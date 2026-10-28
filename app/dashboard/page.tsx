'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChartColumn, ExternalLink, LoaderCircle, LogOut, PencilLine, Settings, Share2 } from 'lucide-react';
import { Analytics } from '@/components/dashboard/Analytics';
import { ClaimUsername } from '@/components/dashboard/ClaimUsername';
import { Editor } from '@/components/dashboard/Editor';
import { ShareModal } from '@/components/dashboard/ShareModal';
import { Logo } from '@/components/Logo';
import { ProfileView } from '@/components/ProfileView';
import { PhoneMockup } from '@/components/site/PhoneMockup';
import { api, ApiError } from '@/src/lib/api';
import { PAYMENTS_ENABLED, PLAN_LIMITS, PRO_PRICE } from '@/src/lib/plans';
import { CLAIM_KEY } from '@/src/lib/site';
import type { MeResponse, Profile, ProfileInput } from '@/src/lib/types';

type Tab = 'editor' | 'analytics' | 'settings';

const TABS: { id: Tab; label: string; icon: typeof PencilLine }[] = [
  { id: 'editor', label: 'Editor', icon: PencilLine },
  { id: 'analytics', label: 'Analytics', icon: ChartColumn },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const toInput = (p: Profile): ProfileInput => ({
  name: p.name,
  bio: p.bio,
  avatar: p.avatar,
  theme: p.theme,
  links: p.links,
});

export default function DashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [draft, setDraft] = useState<ProfileInput | null>(null);
  const [tab, setTab] = useState<Tab>('editor');
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [sharing, setSharing] = useState(false);
  const [origin, setOrigin] = useState('');
  const [claimHint, setClaimHint] = useState('');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- window values are only known after mount
    setOrigin(window.location.origin);
    try {
      setClaimHint(sessionStorage.getItem(CLAIM_KEY) ?? '');
    } catch {
      // Storage blocked: the claim box simply starts empty.
    }
    api<MeResponse>('/api/me').then(
      (res) => {
        setMe(res);
        if (res.profile) setDraft(toInput(res.profile));
      },
      (err) => {
        if (err instanceof ApiError && err.status === 401) router.replace('/login');
        else setNotice({ kind: 'error', text: (err as Error).message });
      },
    );
  }, [router]);

  const saved = me?.profile ? JSON.stringify(toInput(me.profile)) : null;
  const dirty = draft !== null && saved !== null && JSON.stringify(draft) !== saved;

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const onProfile = useCallback((profile: Profile) => {
    setMe((prev) => (prev ? { ...prev, profile } : prev));
    setDraft(toInput(profile));
  }, []);

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setNotice(null);
    try {
      const res = await api<{ profile: Profile }>('/api/profile', { method: 'PUT', body: draft });
      onProfile(res.profile);
      setNotice({ kind: 'ok', text: 'Saved. Your page is live.' });
    } catch (err) {
      setNotice({ kind: 'error', text: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await api('/api/auth/logout', { method: 'POST' }).catch(() => {});
    router.replace('/');
  };

  if (!me) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {notice ? <p className="text-red-600">{notice.text}</p> : <LoaderCircle className="w-6 h-6 animate-spin text-zinc-400" />}
      </div>
    );
  }

  // First visit: pick a username before anything else.
  if (!me.profile || !draft) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-[2rem] border border-black/5 shadow-sm p-8 space-y-6">
          <Logo href="/dashboard" />
          <div>
            <h1 className="text-3xl font-black tracking-tight">Claim your username</h1>
            <p className="mt-1 text-zinc-600">This becomes your link. You can change it later.</p>
          </div>
          <ClaimUsername
            initial={claimHint}
            submitLabel="Claim and continue"
            onClaimed={(profile) => {
              try {
                sessionStorage.removeItem(CLAIM_KEY);
              } catch {}
              onProfile(profile);
            }}
          />
        </div>
      </main>
    );
  }

  const profile = me.profile;
  const plan = me.user.plan;
  const pageUrl = `${origin}/${profile.slug}`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-paper/90 backdrop-blur border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Logo href="/dashboard" />
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 cursor-pointer ${
                  tab === t.id ? 'bg-white shadow-sm' : 'text-zinc-600 hover:bg-white/60'
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </nav>
          <span className="flex-1" />
          <a
            href={pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-sm text-zinc-600 hover:text-ink px-3 py-2"
          >
            /{profile.slug} <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => setSharing(true)}
            className="px-4 py-2 rounded-full bg-white border border-zinc-200 text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button onClick={logout} className="p-2 rounded-full hover:bg-white cursor-pointer" title="Log out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        <nav className="md:hidden flex px-4 pb-2 gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium cursor-pointer ${tab === t.id ? 'bg-white shadow-sm' : 'text-zinc-600'}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {tab === 'editor' && (
          <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-white border border-black/5 rounded-2xl px-4 py-3 sticky top-[72px] z-30">
                <p
                  className={`flex-1 text-sm ${
                    notice?.kind === 'error' ? 'text-red-600' : notice ? 'text-green-700' : 'text-zinc-500'
                  }`}
                >
                  {notice ? notice.text : dirty ? 'You have unsaved changes.' : 'All changes saved.'}
                </p>
                {dirty && (
                  <button
                    onClick={() => {
                      setDraft(toInput(profile));
                      setNotice(null);
                    }}
                    className="text-sm text-zinc-500 hover:text-ink px-3 py-2 cursor-pointer"
                  >
                    Discard
                  </button>
                )}
                <button
                  onClick={save}
                  disabled={!dirty || saving}
                  className="px-6 py-2.5 rounded-full bg-grape-500 hover:bg-grape-600 text-white text-sm font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
              <Editor
                draft={draft}
                plan={plan}
                onChange={(next) => {
                  setDraft(next);
                  setNotice(null);
                }}
                onError={(text) => setNotice({ kind: 'error', text })}
              />
            </div>
            <div className="hidden lg:flex justify-center sticky top-24">
              <PhoneMockup>
                <ProfileView profile={draft} showBranding={PLAN_LIMITS[plan].branding} compact />
              </PhoneMockup>
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div className="max-w-3xl mx-auto">
            <Analytics links={profile.links} plan={plan} />
          </div>
        )}

        {tab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <section className="bg-white border border-black/5 rounded-3xl p-6 space-y-4">
              <div>
                <h2 className="font-semibold">Username</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  If you change it, your old link and QR code will stop working.
                </p>
              </div>
              <ClaimUsername
                key={profile.slug}
                initial={profile.slug}
                current={profile.slug}
                submitLabel="Change username"
                onClaimed={(p) => {
                  onProfile(p);
                  setNotice({ kind: 'ok', text: `Your page is now at /${p.slug}` });
                }}
              />
            </section>

            <section className="bg-white border border-black/5 rounded-3xl p-6 space-y-3">
              <h2 className="font-semibold">Plan</h2>
              <p>
                You&apos;re on <strong>{plan === 'pro' ? 'Pro' : 'Free'}</strong>.
              </p>
              {plan === 'free' && (
                <div className="rounded-2xl bg-grape-500/10 p-4 text-sm">
                  <p className="font-semibold text-grape-600">
                    Pro: ₹{PRO_PRICE.monthly}/month or ₹{PRO_PRICE.yearly}/year
                  </p>
                  <p className="text-zinc-600 mt-1">
                    {PLAN_LIMITS.pro.maxLinks} links, every theme, no branding, {PLAN_LIMITS.pro.analyticsDays}-day
                    analytics.{' '}
                    {PAYMENTS_ENABLED ? '' : 'Payments are launching soon.'}
                  </p>
                  <Link href="/pricing" className="inline-block mt-2 text-grape-600 underline">
                    See pricing
                  </Link>
                </div>
              )}
            </section>

            <section className="bg-white border border-black/5 rounded-3xl p-6 space-y-2">
              <h2 className="font-semibold">Account</h2>
              <p className="text-sm text-zinc-600">Signed in with Google as {me.user.email}</p>
              <button onClick={logout} className="text-sm text-red-600 hover:underline cursor-pointer">
                Log out
              </button>
            </section>
          </div>
        )}
      </main>

      {sharing && <ShareModal url={pageUrl} slug={profile.slug} onClose={() => setSharing(false)} />}
    </div>
  );
}
