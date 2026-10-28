import Link from 'next/link';
import { Logo } from '../Logo';

const COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/features', label: 'Features' },
      { href: '/integrations', label: 'Integrations' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/resources', label: 'Getting started guide' },
      { href: '/resources#faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/contact', label: 'Contact' },
      { href: '/terms', label: 'Terms' },
      { href: '/privacy', label: 'Privacy' },
      { href: '/refund', label: 'Refunds' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="px-3 pb-3 sm:px-4 sm:pb-4 mt-24">
      <div className="max-w-7xl mx-auto bg-ink text-zinc-300 rounded-[2rem] px-8 py-12 grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-4">
          <div className="bg-white inline-flex rounded-full px-4 py-2">
            <Logo />
          </div>
          <p className="text-sm max-w-xs text-zinc-400">
            One link for everything you share. Built for creators, small businesses and anyone with more than one link.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-white font-semibold mb-3">{col.title}</h3>
            <ul className="space-y-2 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="md:col-span-4 border-t border-white/10 pt-6 text-xs text-zinc-500">
          © {new Date().getFullYear()} TripTree. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
