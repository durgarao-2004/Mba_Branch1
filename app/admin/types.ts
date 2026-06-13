// Shared types for the admin portal — imported by page.tsx and all tab components

export type AdminUser = {
  uid: string;
  fullName: string;
  email: string;
  semester?: string;
  specialization?: string;
  role: string;
  createdAt?: { seconds: number };
  // Block / soft-delete fields
  isBlocked?: boolean;
  isDeleted?: boolean;
  blockedReason?: string;
  blockedAt?: { seconds: number };
  blockedBy?: string;
  // Suspension fields
  suspensionEndsAt?: { seconds: number };
  suspendedBy?: string;
  suspendedReason?: string;
  // Soft-delete metadata
  deletedAt?: { seconds: number };
  deletedBy?: string;
};

export type AdminMessage = {
  id: string;
  senderName?: string;
  senderEmail?: string;
  senderUid?: string;
  studentName?: string;   // legacy
  studentEmail?: string;  // legacy
  subject?: string;
  title?: string;         // legacy
  category?: string;
  message: string;
  status: string;
  createdAt?: { seconds: number };
};

export type AuditLogEntry = {
  id: string;
  action: string;
  targetUid: string;
  targetName: string;
  targetEmail: string;
  performedBy: string;
  performedByName: string;
  timestamp?: { seconds: number };
  metadata: Record<string, unknown>;
};

export type UserStatus = 'active' | 'blocked' | 'suspended' | 'deleted';

export function getUserStatus(user: AdminUser): UserStatus {
  if (user.isDeleted)  return 'deleted';
  if (user.isBlocked)  return 'blocked';
  const now = Date.now() / 1000;
  if (user.suspensionEndsAt?.seconds && user.suspensionEndsAt.seconds > now) return 'suspended';
  return 'active';
}

export function fmtDate(seconds?: number): string {
  if (!seconds) return '—';
  return new Date(seconds * 1000).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function fmtDatetime(seconds?: number): string {
  if (!seconds) return '—';
  return new Date(seconds * 1000).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function fmtRelative(seconds?: number): string {
  if (!seconds) return '';
  const diff = Math.floor(Date.now() / 1000 - seconds);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
