'use client';

import { useEffect, useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcon';
import { api } from '@/src/lib/api';
import { getBrandMeta } from '@/src/lib/brands';
import type { AnalyticsResponse, LinkItem, Plan } from '@/src/lib/types';

export function Analytics({ links, plan }: { links: LinkItem[]; plan: Plan }) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<AnalyticsResponse>('/api/analytics').then(setData, (err: Error) => setError(err.message));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <LoaderCircle className="w-6 h-6 animate-spin text-zinc-400 mx-auto my-20" />;

  const totalViews = data.views.reduce((sum, d) => sum + d.count, 0);
  const totalClicks = Object.values(data.clicks).reduce((sum, n) => sum + n, 0);
  const maxViews = Math.max(1, ...data.views.map((d) => d.count));
  const maxClicks = Math.max(1, ...links.map((l) => data.clicks[l.id] ?? 0));
  const ctr = totalViews ? Math.round((totalClicks / totalViews) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Views', value: totalViews },
          { label: 'Clicks', value: totalClicks },
          { label: 'Click rate', value: `${ctr}%` },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-black/5 rounded-3xl p-5">
            <p className="text-sm text-zinc-500">{s.label}</p>
            <p className="text-3xl font-black mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="bg-white border border-black/5 rounded-3xl p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-semibold">Page views</h2>
          <p className="text-xs text-zinc-500">
            Last {data.days} days{plan === 'free' && ' · Pro keeps 90 days'}
          </p>
        </div>
        <div className="mt-6 h-40 flex items-end gap-1">
          {data.views.map((d) => (
            <div key={d.day} className="flex-1 h-full flex flex-col justify-end group relative">
              <div
                className="bg-grape-500 group-hover:bg-grape-600 rounded-t min-h-[2px]"
                style={{ height: `${(d.count / maxViews) * 100}%` }}
              />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] bg-ink text-white rounded px-1.5 py-0.5 hidden group-hover:block whitespace-nowrap z-10">
                {d.day.slice(5)}: {d.count}
              </span>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[11px] text-zinc-400 mt-2">
          <span>{data.views[0]?.day.slice(5)}</span>
          <span>{data.views.at(-1)?.day.slice(5)}</span>
        </div>
      </section>

      <section className="bg-white border border-black/5 rounded-3xl p-6">
        <h2 className="font-semibold mb-4">Clicks per link</h2>
        {links.length === 0 && <p className="text-sm text-zinc-500">Add links to start counting clicks.</p>}
        <ul className="space-y-3">
          {links.map((link) => {
            const count = data.clicks[link.id] ?? 0;
            return (
              <li key={link.id} className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <BrandIcon brand={getBrandMeta(link.url)} className="w-4 h-4 text-zinc-500" />
                  <span className="flex-1 truncate font-medium">{link.title || 'Untitled link'}</span>
                  <span className="font-semibold tabular-nums">{count}</span>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sun-gradient rounded-full" style={{ width: `${(count / maxClicks) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
