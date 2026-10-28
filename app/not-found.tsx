import Link from 'next/link';
import { LogoMark } from '@/components/Logo';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-5 p-6 text-center">
      <LogoMark className="w-14 h-14" />
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Page not found</h1>
      <p className="text-zinc-600">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link href="/" className="px-6 py-3.5 rounded-full bg-ink text-white font-semibold">
        Go to TripTree
      </Link>
    </main>
  );
}
