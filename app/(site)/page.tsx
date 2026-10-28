import Link from 'next/link';
import { ArrowRight, ChartColumn, Palette, QrCode, Share2, UserRound, Link2 } from 'lucide-react';
import { BrandIcon } from '@/components/BrandIcon';
import { ProfileView } from '@/components/ProfileView';
import { ClaimInput } from '@/components/site/ClaimInput';
import { PhoneMockup } from '@/components/site/PhoneMockup';
import { BRANDS } from '@/src/lib/brands';
import { DEMO_PROFILES } from '@/src/lib/demo';
import { PRO_PRICE } from '@/src/lib/plans';

const STEPS = [
  { icon: UserRound, title: 'Claim your name', text: 'Sign in with Google and pick a username. Your page lives at triptree…/yourname.' },
  { icon: Link2, title: 'Add your links', text: 'Paste links to your socials, shop, videos or anything else. Icons are added for you.' },
  { icon: Share2, title: 'Share it everywhere', text: 'Put the link in your bio, or print the QR code on your packaging and posters.' },
];

export default function HomePage() {
  const [hero, ...rest] = DEMO_PROFILES;

  return (
    <>
      {/* Hero */}
      <section className="px-4 pt-14 sm:pt-20 max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
        <div className="space-y-7">
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-[0.95]">
            One link for <span className="text-brand-gradient">everything</span> you share.
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 max-w-xl">
            Put your Instagram, YouTube, shop, newsletter and everything else on one page. Then share a single
            link that never goes out of date.
          </p>
          <ClaimInput />
          <p className="text-sm text-zinc-500">Free forever. No card needed.</p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="absolute -inset-10 bg-sun-gradient rounded-full blur-3xl opacity-40" />
            <PhoneMockup className="relative rotate-2">
              <ProfileView profile={hero} showBranding compact />
            </PhoneMockup>
          </div>
        </div>
      </section>

      {/* Works with */}
      <section className="mt-24 px-4">
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-zinc-500">
          Works with links from
        </p>
        <div className="mt-6 max-w-5xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-5">
          {BRANDS.slice(0, 16).map((b) => (
            <span key={b.name} className="flex items-center gap-2 text-zinc-500" title={b.name}>
              <BrandIcon brand={b} className="w-6 h-6" />
              <span className="text-sm font-medium hidden sm:inline">{b.name}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Themes */}
      <section className="mt-28 px-4 max-w-7xl mx-auto">
        <div className="bg-[#2b2350] text-white rounded-[2.5rem] px-6 sm:px-12 py-14 grid lg:grid-cols-2 gap-12 items-center overflow-hidden">
          <div className="space-y-5">
            <Palette className="w-10 h-10 text-sun-400" />
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Make it look like you.</h2>
            <p className="text-lg text-white/70">
              Pick from four themes, from soft gradients to bold neo-brutalism. You see the change live as you edit,
              and your page updates as soon as you save.
            </p>
            <Link href="/features#themes" className="inline-flex items-center gap-2 font-semibold text-sun-300 hover:text-sun-400">
              Explore themes <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-4 justify-center lg:justify-end">
            {rest.slice(0, 2).map((p) => (
              <PhoneMockup key={p.name} className="scale-90 first:-rotate-3 last:rotate-3 hidden sm:block first:block">
                <ProfileView profile={p} showBranding={false} compact />
              </PhoneMockup>
            ))}
          </div>
        </div>
      </section>

      {/* QR + analytics */}
      <section className="mt-6 px-4 max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        <div className="bg-sun-gradient rounded-[2.5rem] p-10 space-y-4">
          <QrCode className="w-10 h-10" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">A QR code for your page</h2>
          <p className="text-lg text-ink/75">
            Download a QR code that opens your TripTree. Put it on business cards, menus, packaging or a poster at
            your stall.
          </p>
        </div>
        <div className="bg-white rounded-[2.5rem] p-10 space-y-4 border border-black/5">
          <ChartColumn className="w-10 h-10 text-grape-500" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">See what people tap</h2>
          <p className="text-lg text-zinc-600">
            Your dashboard shows how many people visit your page each day and how many times each link was tapped.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mt-28 px-4 max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-center">Ready in two minutes</h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.title} className="bg-white rounded-3xl p-8 border border-black/5">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-ink text-white font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <s.icon className="w-6 h-6 text-grape-500" />
              </div>
              <h3 className="mt-5 text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-zinc-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing teaser + CTA */}
      <section className="mt-28 px-4 max-w-7xl mx-auto">
        <div className="bg-ink text-white rounded-[2.5rem] px-6 sm:px-12 py-16 text-center flex flex-col items-center gap-6">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter">
            Start free. Go <span className="text-brand-gradient">Pro</span> for ₹{PRO_PRICE.monthly}/month.
          </h2>
          <p className="text-lg text-white/70 max-w-2xl">
            The Free plan covers most people. Pro adds unlimited links, every theme, no TripTree branding and 90 days
            of analytics.
          </p>
          <ClaimInput dark />
          <Link href="/pricing" className="text-white/70 hover:text-white underline">
            Compare plans
          </Link>
        </div>
      </section>
    </>
  );
}
