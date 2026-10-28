'use client';

import { useEffect, useState } from 'react';
import { Check, LoaderCircle } from 'lucide-react';
import { api } from '@/src/lib/api';
import { SITE_HOST } from '@/src/lib/site';
import { normalizeSlug, validateSlug } from '@/src/lib/slug';
import type { Profile } from '@/src/lib/types';

type Status = { state: 'idle' | 'checking' | 'ok' } | { state: 'error'; message: string };

interface ClaimUsernameProps {
  initial: string;
  /** The user's current username, when changing rather than claiming */
  current?: string;
  submitLabel: string;
  onClaimed: (profile: Profile) => void;
}

export function ClaimUsername({ initial, current, submitLabel, onClaimed }: ClaimUsernameProps) {
  const [value, setValue] = useState(initial);
  const [remote, setRemote] = useState<{ slug: string; available: boolean; error?: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const slug = normalizeSlug(value);
  const unchanged = !slug || slug === current;
  const localError = unchanged ? null : validateSlug(slug);
  const needsCheck = !unchanged && !localError;

  // Ask the server whether the name is free, debounced while the user types.
  useEffect(() => {
    if (!needsCheck) return;
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await api<{ available: boolean; error?: string }>(
          `/api/username?slug=${encodeURIComponent(slug)}`,
        );
        if (!cancelled) setRemote({ slug, ...res });
      } catch (err) {
        if (!cancelled) setRemote({ slug, available: false, error: (err as Error).message });
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [slug, needsCheck]);

  const status: Status = unchanged
    ? { state: 'idle' }
    : localError
      ? { state: 'error', message: localError }
      : remote?.slug !== slug
        ? { state: 'checking' }
        : remote.available
          ? { state: 'ok' }
          : { state: 'error', message: remote.error ?? 'That name is taken.' };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.state !== 'ok') return;
    setSaving(true);
    try {
      const res = await api<{ profile: Profile }>('/api/username', { method: 'POST', body: { slug } });
      onClaimed(res.profile);
    } catch (err) {
      setRemote({ slug, available: false, error: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="flex items-center rounded-2xl bg-white border border-zinc-300 px-4 py-3.5 focus-within:ring-2 focus-within:ring-grape-500">
        <span className="text-zinc-400 hidden sm:inline">{SITE_HOST}/</span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value.replace(/\s/g, ''))}
          placeholder="yourname"
          aria-label="Username"
          maxLength={30}
          autoFocus
          className="flex-1 min-w-0 bg-transparent outline-none font-medium"
        />
        {status.state === 'checking' && <LoaderCircle className="w-5 h-5 text-zinc-400 animate-spin" />}
        {status.state === 'ok' && <Check className="w-5 h-5 text-green-600" />}
      </label>
      <p className={`text-sm min-h-5 ${status.state === 'error' ? 'text-red-600' : 'text-green-700'}`}>
        {status.state === 'error' ? status.message : status.state === 'ok' ? `${slug} is available!` : ''}
      </p>
      <button
        type="submit"
        disabled={status.state !== 'ok' || saving}
        className="w-full py-3.5 rounded-full bg-ink text-white font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
      >
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
