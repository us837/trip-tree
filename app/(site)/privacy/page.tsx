import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/site/ui';
import { CONTACT_EMAIL } from '@/src/lib/site';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy">Last updated: 28 October 2026</PageHero>
      <Prose>
        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>From Google sign-in:</strong> your name, email address and profile photo URL.
          </li>
          <li>
            <strong>What you publish:</strong> your username, name, bio, photo, theme and links. All of this is public
            on your page.
          </li>
          <li>
            <strong>Analytics:</strong> daily counts of page views and link taps. We do not store visitors&apos; IP
            addresses, set tracking cookies on visitors, or build profiles of visitors.
          </li>
          <li>
            <strong>Session cookie:</strong> one cookie that keeps you signed in. Only a hash of it is stored on our
            side.
          </li>
        </ul>
        <h2>How we use it</h2>
        <p>
          Only to run TripTree: to show your page, keep you signed in, show your analytics and, when Pro launches,
          handle billing. We do not sell your data or show ads.
        </p>
        <h2>Where it is stored</h2>
        <p>
          Data is stored with Cloudflare (hosting and database). Payments, when available, are processed by Razorpay.
          We never see or store your full card details.
        </p>
        <h2>Your choices</h2>
        <p>
          You can edit or remove anything on your page at any time. To delete your account and all its data, email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> from your sign-in address.
        </p>
      </Prose>
    </>
  );
}
