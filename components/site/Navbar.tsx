'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight, ChartColumn, ChevronDown, Link2, Menu, Palette, QrCode, X } from 'lucide-react';
import { Logo } from '../Logo';

export const FEATURE_MENU = [
  { href: '/features#link-in-bio', icon: Link2, title: 'Link in Bio', text: 'One page for everything you share' },
  { href: '/features#themes', icon: Palette, title: 'Themes', text: 'Four looks, switch in one click' },
  { href: '/features#qr-codes', icon: QrCode, title: 'QR Codes', text: 'Print your page on anything' },
  { href: '/features#analytics', icon: ChartColumn, title: 'Click Analytics', text: 'See which links people tap' },
];

const NAV = [
  { href: '/integrations', label: 'Integrations' },
  { href: '/resources', label: 'Resources' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar() {
  const pathname = usePathname();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the features menu on outside click or Escape.
  useEffect(() => {
    if (!featuresOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setFeaturesOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFeaturesOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [featuresOpen]);

  const pill = (active: boolean) =>
    `px-4 py-2.5 rounded-xl text-[15px] font-medium transition ${active ? 'bg-zinc-100' : 'hover:bg-zinc-100'}`;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <div ref={menuRef} className="relative max-w-7xl mx-auto">
        <nav className="bg-white rounded-full shadow-sm border border-black/5 pl-5 pr-2 py-2 flex items-center justify-between gap-4">
          <Logo />

          <div className="hidden lg:flex items-center gap-1 flex-1 ml-6">
            <button
              type="button"
              onClick={() => setFeaturesOpen((o) => !o)}
              aria-expanded={featuresOpen}
              className={`${pill(featuresOpen || pathname === '/features')} flex items-center gap-1 cursor-pointer`}
            >
              Features <ChevronDown className={`w-4 h-4 transition ${featuresOpen ? 'rotate-180' : ''}`} />
            </button>
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className={pill(pathname === item.href)}>
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login" className="px-4 py-2.5 text-[15px] font-medium rounded-xl hover:bg-zinc-100">
              Log in
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-full bg-ink text-white text-[15px] font-semibold hover:bg-black transition"
            >
              Sign up free
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2.5 rounded-full hover:bg-zinc-100"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </nav>

        {featuresOpen && (
          <div className="hidden lg:block absolute left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-xl border border-black/5 p-8">
            <div className="grid grid-cols-4 gap-4">
              {FEATURE_MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setFeaturesOpen(false)}
                  className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-50 transition"
                >
                  <span className="w-14 h-14 shrink-0 rounded-2xl bg-sun-300/30 text-sun-500 flex items-center justify-center">
                    <item.icon className="w-6 h-6" />
                  </span>
                  <span>
                    <span className="block font-semibold">{item.title}</span>
                    <span className="block text-sm text-zinc-500">{item.text}</span>
                  </span>
                </Link>
              ))}
            </div>
            <div className="border-t border-zinc-100 mt-6 pt-5 flex justify-end">
              <Link
                href="/features"
                onClick={() => setFeaturesOpen(false)}
                className="px-5 py-3 rounded-full bg-zinc-100 hover:bg-zinc-200 font-medium flex items-center gap-1.5"
              >
                See all features <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {mobileOpen && (
          <div className="lg:hidden absolute left-0 right-0 mt-3 bg-white rounded-3xl shadow-xl border border-black/5 p-4 space-y-1">
            {[{ href: '/features', label: 'Features' }, ...NAV].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl font-medium hover:bg-zinc-100"
              >
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-3">
              <Link href="/login" className="text-center px-4 py-3 rounded-full border border-zinc-200 font-semibold">
                Log in
              </Link>
              <Link href="/login" className="text-center px-4 py-3 rounded-full bg-ink text-white font-semibold">
                Sign up free
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
