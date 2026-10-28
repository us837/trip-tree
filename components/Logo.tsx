import Link from 'next/link';
import { useId } from 'react';

export function LogoMark({ className = 'w-8 h-8' }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-sun`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD56B" />
          <stop offset="1" stopColor="#FF9A3C" />
        </linearGradient>
        <linearGradient id={`${id}-grape`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7C5CFF" />
          <stop offset="1" stopColor="#F06BA8" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="32" fill={`url(#${id}-sun)`} />
      <path d="M13 15h32v7H32.5v28h-7V22H13z" fill={`url(#${id}-grape)`} />
    </svg>
  );
}

export function Logo({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 shrink-0" aria-label="TripTree home">
      <LogoMark />
      <span className="text-xl font-black tracking-tight text-ink">
        Trip<span className="text-brand-gradient">Tree</span>
      </span>
    </Link>
  );
}
