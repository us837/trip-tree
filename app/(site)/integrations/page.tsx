import type { Metadata } from 'next';
import { BrandIcon } from '@/components/BrandIcon';
import { PageHero } from '@/components/site/ui';
import { BRANDS } from '@/src/lib/brands';

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'TripTree recognises links from Instagram, YouTube, WhatsApp, Spotify, GitHub and more.',
};

// Light brand colors (Snapchat yellow, Gumroad pink) need a dark glyph to stay readable.
function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 170;
}

export default function IntegrationsPage() {
  return (
    <>
      <PageHero eyebrow="Integrations" title="Works with the apps you already use">
        Paste a link and TripTree spots the platform and adds its icon to your button. No setup or extra accounts
        needed.
      </PageHero>

      <section className="px-4 max-w-6xl mx-auto">
        <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {BRANDS.map((b) => (
            <li key={b.name} className="bg-white rounded-3xl border border-black/5 p-6 flex items-center gap-4">
              <span
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  isLight(b.color) ? 'text-ink' : 'text-white'
                }`}
                style={{ backgroundColor: b.color }}
              >
                <BrandIcon brand={b} className="w-6 h-6" />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold truncate">{b.name}</span>
                <span className="block text-xs text-zinc-500 truncate">{b.hosts[0]}</span>
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-10 bg-white rounded-3xl border border-black/5 p-8 text-center text-zinc-600">
          Any other website works too. It gets a globe icon. Email (<code>mailto:</code>) and phone (
          <code>tel:</code>) links are supported as well.
        </div>
      </section>
    </>
  );
}
