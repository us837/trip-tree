'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/Logo';
import { CLAIM_KEY } from '@/src/lib/site';

const ERRORS: Record<string, string> = {
  state: 'Your sign-in session expired. Please try again.',
  google: 'Google sign-in failed. Please try again.',
  email: 'Your Google account needs a verified email address.',
  server: 'Something went wrong on our side. Please try again.',
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const claim = params.get('claim');
    try {
      if (claim) sessionStorage.setItem(CLAIM_KEY, claim);
    } catch {
      // Storage can be blocked; the user just types the name again after sign-in.
    }
    const code = params.get('error');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading the URL once on mount
    if (code) setError(ERRORS[code] ?? ERRORS.server);

    // Already signed in? Skip straight to the dashboard.
    fetch('/api/me').then((res) => res.ok && router.replace('/dashboard'), () => {});
  }, [router]);

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col p-6 sm:p-10">
        <Logo />
        <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto py-16 space-y-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Welcome to TripTree</h1>
            <p className="mt-2 text-zinc-600">Log in or create your free account. It takes one click.</p>
          </div>

          {error && <p className="rounded-xl bg-red-50 text-red-700 px-4 py-3 text-sm">{error}</p>}

          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-full bg-white border border-zinc-300 font-semibold hover:bg-zinc-50 shadow-sm transition"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.95 10.95 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </a>

          <p className="text-xs text-zinc-500">
            By continuing you agree to our <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>.
          </p>
        </div>
      </div>
      <div className="hidden lg:flex bg-sun-gradient items-center justify-center p-12">
        <p className="text-5xl font-black tracking-tighter leading-tight max-w-md">
          One link.
          <br />
          <span className="text-brand-gradient">Everything</span> you share.
        </p>
      </div>
    </main>
  );
}
