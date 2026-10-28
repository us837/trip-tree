import type { Metadata } from 'next';
import { Mail } from 'lucide-react';
import { PageHero } from '@/components/site/ui';
import { CONTACT_EMAIL } from '@/src/lib/site';

export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  return (
    <>
      <PageHero title="Contact us">Questions, feedback, billing or account help: we usually reply within two working days.</PageHero>
      <div className="px-4 flex justify-center">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-3 bg-white rounded-full border border-black/5 px-8 py-5 text-lg font-semibold hover:shadow-md transition"
        >
          <Mail className="w-5 h-5 text-grape-500" /> {CONTACT_EMAIL}
        </a>
      </div>
    </>
  );
}
