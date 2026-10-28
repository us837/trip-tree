import type { Metadata } from 'next';
import { PageHero } from '@/components/site/ui';
import { PricingCards } from '@/components/site/PricingCards';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'TripTree is free to start. Pro is ₹100 a month or ₹1000 a year.',
};

const FAQ = [
  {
    q: 'Is the Free plan really free?',
    a: 'Yes. You get a page, up to 5 links, two themes, a QR code and 7 days of analytics, with no time limit and no card needed.',
  },
  {
    q: 'What happens to my page if I stop paying for Pro?',
    a: 'Your page stays online. Pro-only extras switch off, and you will need to trim to 5 links and pick a Free theme before your next edit.',
  },
  {
    q: 'Can I cancel any time?',
    a: 'Yes. Pro does not renew if you cancel, and you keep Pro until the end of the period you paid for.',
  },
  {
    q: 'Which payment methods are supported?',
    a: 'UPI, cards and netbanking through Razorpay, once Pro payments launch.',
  },
];

export default function PricingPage() {
  return (
    <>
      <PageHero title="Pick your plan. Make it yours.">Simple pricing in rupees. Start free and upgrade when you need more.</PageHero>
      <PricingCards />
      <section className="mt-20 px-4 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight text-center mb-8">Questions</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group bg-white rounded-2xl border border-black/5 p-6">
              <summary className="font-semibold cursor-pointer list-none flex justify-between gap-4">
                {f.q}
                <span className="text-zinc-400 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-zinc-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
