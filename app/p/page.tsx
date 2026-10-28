import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoMark } from '@/components/Logo';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

// Shown for usernames nobody has claimed yet. functions/[slug].ts also reads
// this page's <head> to find the site stylesheet and fonts for public profiles.
export default function UnclaimedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 p-6 text-center">
      <LogoMark className="w-14 h-14" />
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">This page doesn&apos;t exist yet</h1>
      <p className="text-zinc-600">Nobody has claimed this name. It could be yours.</p>
      <Link href="/login" className="px-6 py-3.5 rounded-full bg-ink text-white font-semibold">
        Claim it on TripTree
      </Link>
    </main>
  );
}
