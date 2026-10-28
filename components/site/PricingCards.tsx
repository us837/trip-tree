'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Star } from 'lucide-react';
import { PAYMENTS_ENABLED, PLAN_LIMITS, PRO_PRICE } from '@/src/lib/plans';

const FREE_FEATURES = [
  'Your own triptree…/username page',
  `Up to ${PLAN_LIMITS.free.maxLinks} links`,
  `${PLAN_LIMITS.free.themes.length} themes`,
  'QR code download',
  `${PLAN_LIMITS.free.analyticsDays}-day analytics`,
];

const PRO_FEATURES = [
  `Up to ${PLAN_LIMITS.pro.maxLinks} links`,
  'All themes, including Funk Suburban and Cyberpunk',
  'Remove TripTree branding',
  `${PLAN_LIMITS.pro.analyticsDays}-day analytics`,
];

export function PricingCards() {
  const [yearly, setYearly] = useState(true);
  const price = yearly ? PRO_PRICE.yearly : PRO_PRICE.monthly;
  const monthsFree = 12 - PRO_PRICE.yearly / PRO_PRICE.monthly;

  return (
    <section className="px-4">
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-white rounded-full p-1 border border-black/5 shadow-sm">
          {[
            { label: 'Monthly', value: false },
            { label: 'Yearly', value: true },
          ].map((o) => (
            <button
              key={o.label}
              type="button"
              onClick={() => setYearly(o.value)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition cursor-pointer ${
                yearly === o.value ? 'bg-ink text-white' : 'text-zinc-600'
              }`}
            >
              {o.label}
              {o.value && <span className="ml-1.5 text-xs text-sun-500">{monthsFree} months free</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <Card
          name="Free"
          price="₹0"
          period="forever"
          note="No card needed"
          cta={
            <Link href="/login" className="block text-center py-3.5 rounded-full border border-zinc-300 font-semibold hover:bg-zinc-50">
              Get started
            </Link>
          }
          intro="Everything you need to start:"
          features={FREE_FEATURES}
        />
        <Card
          highlight
          name="Pro"
          price={`₹${price.toLocaleString('en-IN')}`}
          period={yearly ? '/year' : '/month'}
          note={yearly ? `Works out to about ₹${Math.round(PRO_PRICE.yearly / 12)}/month` : `or ₹${PRO_PRICE.yearly.toLocaleString('en-IN')} billed yearly`}
          cta={
            PAYMENTS_ENABLED ? (
              <Link href="/dashboard?upgrade=1" className="block text-center py-3.5 rounded-full bg-grape-500 hover:bg-grape-600 text-white font-semibold">
                Upgrade to Pro
              </Link>
            ) : (
              <span className="block text-center py-3.5 rounded-full bg-grape-500/15 text-grape-600 font-semibold">
                Coming soon. Start on Free today.
              </span>
            )
          }
          intro="Everything in Free, plus:"
          features={PRO_FEATURES}
        />
      </div>
    </section>
  );
}

function Card(props: {
  name: string;
  price: string;
  period: string;
  note: string;
  cta: React.ReactNode;
  intro: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-[2rem] overflow-hidden border-2 ${
        props.highlight ? 'border-grape-500 bg-[#f6f2ff] shadow-xl' : 'border-black/5 bg-white'
      }`}
    >
      {props.highlight && (
        <span className="absolute top-5 right-5 inline-flex items-center gap-1 text-xs font-bold text-grape-600 bg-white rounded-full px-3 py-1">
          <Star className="w-3.5 h-3.5 fill-current" /> Recommended
        </span>
      )}
      <div className={`px-8 py-6 ${props.highlight ? 'bg-grape-500/15' : 'bg-zinc-100'}`}>
        <h2 className={`text-4xl font-black tracking-tight ${props.highlight ? 'text-grape-600' : ''}`}>{props.name}</h2>
      </div>
      <div className="p-8 space-y-6">
        <div>
          <p>
            <span className="text-4xl font-black">{props.price}</span>
            <span className="text-lg text-zinc-600">{props.period}</span>
          </p>
          <p className="mt-2 text-sm text-zinc-500">{props.note}</p>
        </div>
        {props.cta}
        <div className="border-t border-black/10 pt-6">
          <p className="text-sm text-zinc-500 mb-3">{props.intro}</p>
          <ul className="space-y-2.5">
            {props.features.map((f) => (
              <li key={f} className="flex gap-3">
                <Check className={`w-5 h-5 shrink-0 mt-0.5 ${props.highlight ? 'text-grape-500' : 'text-zinc-500'}`} />
                <span className="font-medium">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
