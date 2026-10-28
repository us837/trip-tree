'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SITE_HOST } from '@/src/lib/site';

/** "triptree.../[yourname] [Claim]" box. The name is carried through sign-in via ?claim=. */
export function ClaimInput({ dark = false }: { dark?: boolean }) {
  const router = useRouter();
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const slug = name.trim().toLowerCase();
        router.push(slug ? `/login?claim=${encodeURIComponent(slug)}` : '/login');
      }}
      className="flex flex-col sm:flex-row gap-3 w-full max-w-xl"
    >
      <label
        className={`flex-1 flex items-center rounded-2xl px-4 py-4 text-base sm:text-lg ${
          dark ? 'bg-white text-ink' : 'bg-white border border-black/10 shadow-sm'
        } focus-within:ring-2 focus-within:ring-grape-500`}
      >
        <span className="text-zinc-400 whitespace-nowrap hidden md:inline">{SITE_HOST}/</span>
        <span className="text-zinc-400 md:hidden">triptree/</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value.replace(/\s/g, ''))}
          placeholder="yourname"
          aria-label="Choose your username"
          className="flex-1 min-w-0 bg-transparent outline-none font-medium"
          maxLength={30}
        />
      </label>
      <button
        type="submit"
        className="px-7 py-4 rounded-full bg-grape-500 hover:bg-grape-600 text-white font-semibold text-base sm:text-lg transition cursor-pointer whitespace-nowrap"
      >
        Claim your TripTree
      </button>
    </form>
  );
}
