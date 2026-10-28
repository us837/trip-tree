import type { ReactNode } from 'react';

export function PageHero({ eyebrow, title, children }: { eyebrow?: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="px-4 pt-16 pb-12 text-center max-w-3xl mx-auto">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-grape-500 mb-4">{eyebrow}</p>}
      <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-[1.05]">{title}</h1>
      {children && <p className="mt-5 text-lg text-zinc-600">{children}</p>}
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10 bg-white rounded-[2rem] border border-black/5 space-y-4 text-zinc-700 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:pt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1 [&_a]:text-grape-600 [&_a]:underline">
      {children}
    </div>
  );
}
