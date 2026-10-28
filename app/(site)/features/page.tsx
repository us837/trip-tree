import type { Metadata } from 'next';
import Link from 'next/link';
import { ChartColumn, Check, GripVertical, Link2, Palette, QrCode, ShieldCheck, Smartphone } from 'lucide-react';
import { ProfileView } from '@/components/ProfileView';
import { PhoneMockup } from '@/components/site/PhoneMockup';
import { PageHero } from '@/components/site/ui';
import { DEMO_PROFILES } from '@/src/lib/demo';

export const metadata: Metadata = {
  title: 'Features',
  description: 'Everything TripTree does: link-in-bio pages, themes, QR codes, click analytics and more.',
};

const SECTIONS = [
  {
    id: 'link-in-bio',
    icon: Link2,
    title: 'Link in Bio',
    text: 'One short, memorable page at triptree…/yourname that holds every link you want to share.',
    points: [
      'Pick your own username',
      'Add a name, a short bio and a profile photo',
      'Icons are added for Instagram, YouTube, WhatsApp and 30 other platforms',
      'Hide a link without deleting it, and drag to reorder',
    ],
    demo: 0,
  },
  {
    id: 'themes',
    icon: Palette,
    title: 'Themes',
    text: 'Switch the whole look of your page in one click. The preview updates as you edit.',
    points: [
      'Liquid Mesh and Tokyo Minimal on every plan',
      'Funk Suburban and Cyberpunk with Pro',
      'Every theme works on phones, tablets and desktops',
    ],
    demo: 2,
  },
  {
    id: 'qr-codes',
    icon: QrCode,
    title: 'QR Codes',
    text: 'Every page gets a QR code. Scan it and you land on your TripTree.',
    points: [
      'Download it as an SVG, which stays sharp at any print size',
      'Your QR code keeps working when you change your links',
      'Great for business cards, menus, product packaging and events',
    ],
    demo: 3,
  },
  {
    id: 'analytics',
    icon: ChartColumn,
    title: 'Click Analytics',
    text: 'Find out what your audience actually taps.',
    points: [
      'Page views per day',
      'Taps per link',
      'Last 7 days on Free, last 90 days on Pro',
    ],
    demo: 1,
  },
];

const EXTRAS = [
  { icon: Smartphone, title: 'Built for phones', text: 'Most people open bio links on their phones, so every page is designed for small screens first.' },
  { icon: ShieldCheck, title: 'Safe links only', text: 'Only web, email and phone links are allowed, which blocks script-based tricks.' },
  { icon: GripVertical, title: 'Drag to reorder', text: 'Move your most important link to the top in a second.' },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHero eyebrow="Features" title="Everything your link in bio needs">
        TripTree keeps things simple: a fast page, a QR code, and numbers that tell you what&apos;s working.
      </PageHero>

      <div className="px-4 max-w-6xl mx-auto space-y-6">
        {SECTIONS.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="scroll-mt-28 bg-white rounded-[2.5rem] border border-black/5 p-8 sm:p-12 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center"
          >
            <div className={`space-y-5 ${i % 2 ? 'md:order-2' : ''}`}>
              <span className="w-14 h-14 rounded-2xl bg-sun-300/30 text-sun-500 flex items-center justify-center">
                <s.icon className="w-7 h-7" />
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{s.title}</h2>
              <p className="text-lg text-zinc-600">{s.text}</p>
              <ul className="space-y-2.5">
                {s.points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <Check className="w-5 h-5 mt-0.5 text-grape-500 shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-center">
              <PhoneMockup className="scale-90">
                <ProfileView profile={DEMO_PROFILES[s.demo]} showBranding={false} compact />
              </PhoneMockup>
            </div>
          </section>
        ))}

        <section className="grid md:grid-cols-3 gap-6 pt-6">
          {EXTRAS.map((e) => (
            <div key={e.title} className="bg-white rounded-3xl border border-black/5 p-8">
              <e.icon className="w-7 h-7 text-grape-500" />
              <h3 className="mt-4 text-xl font-bold">{e.title}</h3>
              <p className="mt-2 text-zinc-600">{e.text}</p>
            </div>
          ))}
        </section>

        <div className="text-center pt-10">
          <Link href="/login" className="inline-block px-8 py-4 rounded-full bg-ink text-white font-semibold text-lg">
            Create your free page
          </Link>
        </div>
      </div>
    </>
  );
}
