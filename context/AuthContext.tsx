'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
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
  // Account state (set by admin)
  isBlocked?: boolean;
  isDeleted?: boolean;
  blockedReason?: string;
  suspensionEndsAt?: { seconds: number };
  suspendedReason?: string;
}

// ── Context shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser:    User | null;
  userProfile:    UserProfile | null;
  loading:        boolean;
  profileLoading: boolean;
  logout:         () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  currentUser:    null,
  userProfile:    null,
  loading:        true,
  profileLoading: false,
  logout:         async () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser]       = useState<User | null>(null);
  const [userProfile, setUserProfile]       = useState<UserProfile | null>(null);
  const [loading, setLoading]               = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        setProfileLoading(true);
        try {
          const snap = await getDoc(doc(db, 'users', user.uid));
          if (snap.exists()) {
            const profile = snap.data() as UserProfile;

            // Enforce block / soft-delete: sign out immediately, show nothing
            if (profile.isBlocked || profile.isDeleted) {
              await signOut(auth);
              // onAuthStateChanged fires again with user=null — cleanup happens there
              return;
            }

            setUserProfile(profile);
          } else {
            setUserProfile(null);
          }
        } catch {
          setUserProfile(null);
        } finally {
          setProfileLoading(false);
          setLoading(false);
        }
      } else {
        setUserProfile(null);
        setProfileLoading(false);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  async function logout() {
    await signOut(auth);
    setUserProfile(null);
  }

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, loading, profileLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
