import type { ReactNode } from 'react';

export function PhoneMockup({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative w-[280px] h-[560px] bg-black border-[6px] border-zinc-900 rounded-[2.75rem] shadow-2xl overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-zinc-900 rounded-b-2xl z-10" />
      <div className="h-full overflow-y-auto">{children}</div>
    </div>
  );
}
