'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

// ── User profile type (canonical source) ──────────────────────────────────────

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  semester: string;
  specialization: string;
  interests: string[];
  role: 'student' | 'admin' | 'mentor' | string;
  // Account state fields — written only by admins via Firestore rules
  isBlocked?: boolean;
  isDeleted?: boolean;
  blockedReason?: string;
  suspensionEndsAt?: { seconds: number };
  suspendedReason?: string;
}

// ── Suspension helper ─────────────────────────────────────────────────────────

export function isSuspended(profile: UserProfile | null): boolean {
  if (!profile?.suspensionEndsAt?.seconds) return false;
  return profile.suspensionEndsAt.seconds > Date.now() / 1000;
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser:     User | null;
  userProfile:     UserProfile | null;
  loading:         boolean;
  profileLoading:  boolean;
  profileError:    boolean;        // true when Firestore profile read failed
  logout:          () => Promise<void>;
  refreshProfile:  () => Promise<void>; // force re-fetch Firestore profile
}

const AuthContext = createContext<AuthContextValue>({
  currentUser:    null,
  userProfile:    null,
  loading:        true,
  profileLoading: false,
  profileError:   false,
  logout:         async () => {},
  refreshProfile: async () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser,    setCurrentUser]    = useState<User | null>(null);
  const [userProfile,    setUserProfile]    = useState<UserProfile | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError,   setProfileError]   = useState(false);

  // ── Shared profile-fetch logic ─────────────────────────────────────────────

  const fetchProfile = useCallback(async (user: User) => {
    setProfileLoading(true);
    setProfileError(false);
    try {
      const snap = await getDoc(doc(db, 'users', user.uid));
      if (snap.exists()) {
        const profile = snap.data() as UserProfile;

        // Server-side block / soft-delete enforcement.
        // Firestore rules also enforce this, but signing out here prevents
        // any UI flash for blocked users before the Firestore rule fires.
        if (profile.isBlocked || profile.isDeleted) {
          await signOut(auth);
          // onAuthStateChanged re-fires with user=null → cleanup runs there
          return;
        }

        setUserProfile(profile);
      } else {
        // Auth account exists but no Firestore document — treat as signed out.
        setUserProfile(null);
      }
    } catch {
      // Firestore read failed (network error, permission denied, etc.)
      // Keep currentUser in state so pages can show an error rather than
      // silently redirecting to login.
      setUserProfile(null);
      setProfileError(true);
    } finally {
      setProfileLoading(false);
      setLoading(false);
    }
  }, []);

  // ── Auth state listener ────────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        await fetchProfile(user);
      } else {
        setUserProfile(null);
        setProfileError(false);
        setProfileLoading(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [fetchProfile]);

  // ── Public refresh function ────────────────────────────────────────────────
  // Lets pages (e.g. admin portal after a role change on self) re-fetch
  // the Firestore profile without waiting for an auth state change.

  const refreshProfile = useCallback(async () => {
    if (!currentUser) return;
    await fetchProfile(currentUser);
  }, [currentUser, fetchProfile]);

  // ── Logout ────────────────────────────────────────────────────────────────

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
    setProfileError(false);
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        profileLoading,
        profileError,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
