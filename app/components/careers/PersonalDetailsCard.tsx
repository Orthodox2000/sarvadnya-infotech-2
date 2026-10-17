'use client';

import { useEffect, useState } from 'react';

/**
 * CHANGE: 2026-10-17 — candidate "Personal Details" section (owner request).
 * WHY: the candidate's own details (email, gender, qualification, age, …) should be visible right
 * after login and EDITABLE only after an explicit "Unlock to edit" press. The same values are used
 * to autofill the job application form (see QuickApplyModal).
 *
 * Behaviour:
 *  - Collapsible, HIDDEN by default (owner: "hidden post login by default, people have to expand").
 *  - Locked (read-only) by default; "Unlock to edit" reveals the inputs.
 *  - Saving POSTs only the profile fields to /api/auth/careers/profile (auth-gated, allow-listed
 *    server-side) and hands the fresh user back via onUpdate.
 *
 * HYDRATION: the entrance is `mounted`-gated and nothing reads `window` during render, so SSR and
 * the first client render agree.
 */

interface PersonalDetailsCardProps {
  user: any;
  onUpdate?: (user: any) => void;
}

type FieldKey =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'gender'
  | 'age'
  | 'qualification'
  | 'skills'
  | 'experience'
  | 'experienceDetails'
  | 'city';

interface FieldDef {
  key: FieldKey;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select';
  placeholder?: string;
  options?: string[];
  /** Autofill / autocomplete hint for the browser. */
  autoComplete?: string;
}

const FIELDS: FieldDef[] = [
  { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your name', autoComplete: 'name' },
  { key: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com', autoComplete: 'email' },
  { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+91 XXXXX XXXXX', autoComplete: 'tel' },
  { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  { key: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 24' },
  { key: 'qualification', label: 'Qualification', type: 'text', placeholder: 'e.g. BCA, BSc, MBA' },
  { key: 'skills', label: 'Skills', type: 'text', placeholder: 'e.g. Excel, Tally, Digital Marketing' },
  { key: 'experience', label: 'Experience (Years)', type: 'text', placeholder: 'e.g. 2 years' },
  { key: 'experienceDetails', label: 'Experience Details', type: 'text', placeholder: 'Previous role / company' },
  { key: 'city', label: 'City / Location', type: 'text', placeholder: 'e.g. Navi Mumbai', autoComplete: 'address-level2' },
];

/** The empty editable shape, built from the field list so the two can never drift. */
function blankForm(): Record<FieldKey, string> {
  return FIELDS.reduce((acc, f) => {
    acc[f.key] = '';
    return acc;
  }, {} as Record<FieldKey, string>);
}

/** Read the editable values off a user record (missing age → ''). */
function formFromUser(user: any): Record<FieldKey, string> {
  const out = blankForm();
  if (!user) return out;
  for (const f of FIELDS) {
    const v = user[f.key];
    out[f.key] = v === undefined || v === null ? '' : String(v);
  }
  return out;
}

/** Human display for the locked view (empty → "Not set"). */
function displayValue(user: any, key: FieldKey): string {
  const v = user?.[key];
  if (v === undefined || v === null || String(v).trim() === '') return '';
  return String(v);
}

export function PersonalDetailsCard({ user, onUpdate }: PersonalDetailsCardProps) {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState<Record<FieldKey, string>>(() => formFromUser(user));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keep the editable form in sync with the account while the user is NOT editing, so a save
  // elsewhere (or a fresh login payload) is reflected without clobbering in-progress typing.
  useEffect(() => {
    if (!editing) setForm(formFromUser(user));
  }, [user, editing]);

  const startEdit = () => {
    setForm(formFromUser(user));
    setError(null);
    setSuccess(null);
    setEditing(true);
  };

  const cancelEdit = () => {
    setForm(formFromUser(user));
    setEditing(false);
    setError(null);
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/auth/careers/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Failed to save your details.');
      if (onUpdate && data?.user) onUpdate(data.user);
      setEditing(false);
      setSuccess('Your details have been saved.');
      window.setTimeout(() => setSuccess(null), 2500);
    } catch (err: any) {
      setError(err?.message || 'Failed to save your details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="mt-4 rounded-xl border border-[#E5F4F4] bg-white/70"
      style={{
        opacity: mounted ? 1 : 0,
        transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Section header — the whole row is the expand/collapse control. */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls="careers-personal-details"
        className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[#F5F4ED]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30"
      >
        <span className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-full bg-teal-50 text-[#006569]" aria-hidden="true">
            {/* lock glyph */}
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Personal Details</span>
        </span>
        <span
          aria-hidden="true"
          className={`grid h-5 w-5 flex-shrink-0 place-items-center rounded-full border text-[12px] leading-none transition-colors ${
            expanded ? 'border-[#006569] bg-[#006569] text-white' : 'border-[#B8DEDE] text-[#006569]'
          }`}
        >
          {expanded ? '\u2212' : '+'}
        </span>
      </button>

      {expanded && (
        <div id="careers-personal-details" className="border-t border-[#E5F4F4] px-3 py-3">
          {!editing ? (
            <>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                {FIELDS.map((f) => {
                  const value = displayValue(user, f.key);
                  return (
                    <div key={f.key} className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{f.label}</p>
                      <p className={`mt-0.5 truncate text-xs font-semibold ${value ? 'text-slate-700' : 'text-slate-300'}`}>
                        {value || 'Not set'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {success && (
                <p role="status" className="mt-3 text-[10px] font-semibold text-[#006569]">
                  {success}
                </p>
              )}

              <button
                type="button"
                onClick={startEdit}
                className="mt-3 inline-flex min-h-9 items-center gap-1.5 rounded-full bg-teal-50 px-3 text-[10px] font-bold uppercase tracking-widest text-[#006569] transition-colors hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/30"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                </svg>
                Unlock to edit
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 sm:grid-cols-2">
                {FIELDS.map((f) => (
                  <div key={f.key} className="min-w-0 space-y-1">
                    <label
                      htmlFor={`pd-${f.key}`}
                      className="block text-[9px] font-black uppercase tracking-widest text-slate-400"
                    >
                      {f.label}
                    </label>
                    {f.type === 'select' ? (
                      <select
                        id={`pd-${f.key}`}
                        value={form[f.key]}
                        onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                        className="w-full rounded-lg border border-[#E5F4F4] bg-[#F5F4ED]/50 px-3 py-2 text-xs text-slate-900 transition-colors hover:border-[#006569]/40 focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
                      >
                        <option value="">Select</option>
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`pd-${f.key}`}
                        type={f.type}
                        inputMode={f.type === 'number' ? 'numeric' : undefined}
                        min={f.key === 'age' ? 14 : undefined}
                        max={f.key === 'age' ? 100 : undefined}
                        autoComplete={f.autoComplete}
                        value={form[f.key]}
                        placeholder={f.placeholder}
                        onChange={(e) =>
                          setForm((s) => ({
                            ...s,
                            [f.key]: f.type === 'tel' ? e.target.value.replace(/[^0-9+]/g, '') : e.target.value,
                          }))
                        }
                        className="w-full rounded-lg border border-[#E5F4F4] bg-[#F5F4ED]/50 px-3 py-2 text-xs text-slate-900 transition-colors placeholder:text-slate-400 hover:border-[#006569]/40 focus:border-[#006569] focus:outline-none focus:ring-2 focus:ring-[#006569]/20"
                      />
                    )}
                  </div>
                ))}
              </div>

              {error && (
                <p role="alert" className="mt-3 text-[10px] font-semibold text-red-600">
                  {error}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="inline-flex min-h-9 items-center rounded-full bg-[#006569] px-3 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#005559] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/40 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={saving}
                  className="inline-flex min-h-9 items-center rounded-full border border-[#E5F4F4] bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 transition-colors hover:bg-[#F5F4ED]/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#006569]/20 disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
