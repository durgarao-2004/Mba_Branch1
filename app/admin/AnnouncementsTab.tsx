'use client';

import { useState, useEffect, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminUser } from './types';

type TargetType = 'all' | 'specific' | 'semester' | 'specialization';

interface NotifForm {
  title: string;
  message: string;
  targetType: TargetType;
  targetUid: string;
  targetSemester: string;
  targetSpecialization: string;
}

interface Props {
  users: AdminUser[];
  currentUid: string;
  currentName: string;
  onToast: (msg: string, ok?: boolean) => void;
}

const TARGET_OPTIONS: { value: TargetType; label: string; description: string }[] = [
  { value: 'all',             label: '📢 All Users',         description: 'Every user on the platform' },
  { value: 'semester',        label: '📅 By Semester',        description: 'All students in a semester'  },
  { value: 'specialization',  label: '🎯 By Specialization',  description: 'All students with a specialization' },
  { value: 'specific',        label: '👤 Specific User',      description: 'One individual user'         },
];

export default function AnnouncementsTab({ users, currentUid, currentName, onToast }: Props) {
  // ── Popup settings state ───────────────────────────────────────────────────
  const [popupEnabled, setPopupEnabled]     = useState(false);
  const [popupLoading, setPopupLoading]     = useState(true);
  const [popupSaving,  setPopupSaving]      = useState(false);

  useEffect(() => {
    async function loadPopup() {
      try {
        const snap = await getDoc(doc(db, 'config', 'launchPopup'));
        if (snap.exists()) setPopupEnabled(snap.data()?.enabled === true);
      } catch { /* admin doc not yet created — default to false */ }
      setPopupLoading(false);
    }
    loadPopup();
  }, []);

  async function savePopup(newEnabled: boolean) {
    setPopupSaving(true);
    try {
      await setDoc(doc(db, 'config', 'launchPopup'), {
        enabled:   newEnabled,
        updatedAt: serverTimestamp(),
        updatedBy: currentUid,
      });
      setPopupEnabled(newEnabled);
      onToast(`Launch popup ${newEnabled ? 'enabled' : 'disabled'} successfully.`);
    } catch {
      onToast('Failed to update popup config. Check Firestore permissions.', false);
    } finally {
      setPopupSaving(false);
    }
  }

  // ── Announcement form state ────────────────────────────────────────────────
  const [form, setForm] = useState<NotifForm>({
    title: '', message: '', targetType: 'all',
    targetUid: '', targetSemester: '', targetSpecialization: '',
  });
  const [errors,   setErrors]   = useState<Partial<Record<keyof NotifForm, string>>>({});
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [sentInfo, setSentInfo] = useState('');

  const semesters       = [...new Set(users.map((u) => u.semester).filter(Boolean) as string[])].sort();
  const specializations = [...new Set(users.map((u) => u.specialization).filter(Boolean) as string[])].sort();
  const nonAdminUsers   = users.filter((u) => !u.isDeleted);

  function update(field: keyof NotifForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  }

  function validate(): boolean {
    const e: typeof errors = {};
    if (!form.title.trim())   e.title   = 'Title is required.';
    if (!form.message.trim()) e.message = 'Message is required.';
    if (form.targetType === 'specific'       && !form.targetUid)          e.targetUid          = 'Please select a user.';
    if (form.targetType === 'semester'       && !form.targetSemester)     e.targetSemester     = 'Please select a semester.';
    if (form.targetType === 'specialization' && !form.targetSpecialization) e.targetSpecialization = 'Please select a specialization.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);

    try {
      const docData: Record<string, unknown> = {
        title:      form.title.trim(),
        message:    form.message.trim(),
        targetType: form.targetType,
        sentBy:     currentUid,
        sentByName: currentName,
        createdAt:  serverTimestamp(),
        readBy:     [],
      };

      if (form.targetType === 'specific')       docData.targetUid          = form.targetUid;
      if (form.targetType === 'semester')        docData.targetSemester     = form.targetSemester;
      if (form.targetType === 'specialization')  docData.targetSpecialization = form.targetSpecialization;

      await addDoc(collection(db, 'notifications'), docData);

      let info = '';
      if (form.targetType === 'all')            info = 'all users';
      else if (form.targetType === 'specific')   info = nonAdminUsers.find((u) => u.uid === form.targetUid)?.fullName ?? 'selected user';
      else if (form.targetType === 'semester')   info = `all students in ${form.targetSemester}`;
      else if (form.targetType === 'specialization') info = `all ${form.targetSpecialization} students`;

      setSentInfo(info);
      setSent(true);
      onToast('Notification sent.');
    } catch {
      onToast('Failed to send notification.', false);
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setForm({ title: '', message: '', targetType: 'all', targetUid: '', targetSemester: '', targetSpecialization: '' });
    setErrors({});
    setSent(false);
    setSentInfo('');
  }

  const inpCls = (err?: string) =>
    `w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 bg-white outline-none transition-colors placeholder-slate-400 ${
      err ? 'border-red-400 focus:ring-2 focus:ring-red-100'
          : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
    }`;

  return (
    <div className="max-w-2xl space-y-4">

      {/* ── Launch Popup Settings ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 bg-indigo-900 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
            🚀
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Launch Popup Settings</h2>
            <p className="text-xs text-slate-500">
              Control the bilingual welcome popup shown to visitors on the site
            </p>
          </div>
        </div>

        {popupLoading ? (
          <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
            <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
            Loading popup config…
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-sm font-medium text-slate-800">Launch Popup</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {popupEnabled
                    ? 'Currently visible to visitors (3-day cooldown per user)'
                    : 'Currently hidden — visitors will not see it'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  popupEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  {popupEnabled ? 'ENABLED' : 'DISABLED'}
                </span>
                <button
                  onClick={() => savePopup(!popupEnabled)}
                  disabled={popupSaving}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                    popupEnabled ? 'bg-blue-700' : 'bg-slate-300'
                  } ${popupSaving ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                      popupEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => savePopup(true)}
                disabled={popupSaving || popupEnabled}
                className="px-4 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                Enable Popup
              </button>
              <button
                onClick={() => savePopup(false)}
                disabled={popupSaving || !popupEnabled}
                className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 disabled:text-slate-300 disabled:border-slate-100 text-slate-700 font-semibold rounded-xl transition-colors text-sm"
              >
                Disable Popup
              </button>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              The popup reads Firestore <code className="bg-slate-100 px-1 rounded">config/launchPopup</code>.
              Changes take effect immediately for all new visitors. Users who already dismissed it will not see
              it again for 3 days regardless of this setting.
            </p>
          </div>
        )}
      </div>

      {/* ── Announcement Form ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-blue-900 rounded-xl flex items-center justify-center text-white text-lg flex-shrink-0">
            📢
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Send Announcement</h2>
            <p className="text-xs text-slate-500">
              Target all users, a semester, a specialization, or a specific student
            </p>
          </div>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Announcement Sent!</h3>
            <p className="text-sm text-slate-500 mb-6">
              Delivered to <strong className="text-slate-700">{sentInfo}</strong>.
            </p>
            <button
              onClick={reset}
              className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-5">

            {/* Target type selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Send To</label>
              <div className="grid grid-cols-2 gap-2">
                {TARGET_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                      form.targetType === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="targetType"
                      value={opt.value}
                      checked={form.targetType === opt.value}
                      onChange={() => setForm((prev) => ({
                        ...prev,
                        targetType: opt.value,
                        targetUid: '', targetSemester: '', targetSpecialization: '',
                      }))}
                      className="accent-blue-700 mt-0.5 flex-shrink-0"
                    />
                    <div>
                      <p className={`text-xs font-semibold ${form.targetType === opt.value ? 'text-blue-800' : 'text-slate-700'}`}>
                        {opt.label}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Conditional secondary selector */}
            {form.targetType === 'specific' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select User</label>
                <select
                  value={form.targetUid}
                  onChange={(e) => update('targetUid', e.target.value)}
                  className={inpCls(errors.targetUid)}
                >
                  <option value="">Choose a user…</option>
                  {nonAdminUsers.map((u) => (
                    <option key={u.uid} value={u.uid}>
                      {u.fullName} — {u.email} ({u.role})
                    </option>
                  ))}
                </select>
                {errors.targetUid && <p className="mt-1 text-xs text-red-600">{errors.targetUid}</p>}
              </div>
            )}

            {form.targetType === 'semester' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Semester</label>
                <select
                  value={form.targetSemester}
                  onChange={(e) => update('targetSemester', e.target.value)}
                  className={inpCls(errors.targetSemester)}
                >
                  <option value="">Choose a semester…</option>
                  {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.targetSemester && <p className="mt-1 text-xs text-red-600">{errors.targetSemester}</p>}
              </div>
            )}

            {form.targetType === 'specialization' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Specialization</label>
                <select
                  value={form.targetSpecialization}
                  onChange={(e) => update('targetSpecialization', e.target.value)}
                  className={inpCls(errors.targetSpecialization)}
                >
                  <option value="">Choose a specialization…</option>
                  {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.targetSpecialization && <p className="mt-1 text-xs text-red-600">{errors.targetSpecialization}</p>}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. New lectures uploaded — Financial Management"
                className={inpCls(errors.title)}
              />
              {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
                rows={3}
                placeholder="What do you want to tell your students?"
                className={`${inpCls(errors.message)} resize-none`}
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors text-sm flex items-center gap-2"
            >
              {sending && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {sending ? 'Sending…' : 'Send Announcement'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
