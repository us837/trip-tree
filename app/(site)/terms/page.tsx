import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/site/ui';
import { PRO_PRICE } from '@/src/lib/plans';
import { CONTACT_EMAIL } from '@/src/lib/site';

export const metadata: Metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service">Last updated: 28 October 2026</PageHero>
      <Prose>
        <p>
          These terms apply when you use TripTree (&quot;we&quot;, &quot;us&quot;). By creating an account you agree to
          them.
        </p>
        <h2>Your account</h2>
        <p>
          You sign in with a Google account. You are responsible for everything published on your page. You must be at
          least 13 years old to use TripTree.
        </p>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not link to malware, phishing, scams or illegal content.</li>
          <li>Do not impersonate another person or brand, or use a username that infringes a trademark.</li>
          <li>Do not post hateful, harassing or sexually explicit content involving minors.</li>
        </ul>
        <p>We may remove pages or reassign usernames that break these rules, with or without notice.</p>
        <h2>Plans and payment</h2>
        <p>
          The Free plan costs nothing. TripTree Pro costs ₹{PRO_PRICE.monthly} per month or ₹{PRO_PRICE.yearly} per
          year, charged in advance through our payment partner. Prices include applicable taxes unless stated
          otherwise. You can cancel at any time, and Pro stays active until the end of the paid period. See our{' '}
          <a href="/refund">refund policy</a>.
        </p>
        <h2>Availability</h2>
        <p>
          We work to keep TripTree online but cannot guarantee uninterrupted service. TripTree is provided &quot;as
          is&quot;, without warranties of any kind.
        </p>
        <h2>Changes</h2>
        <p>We may update these terms. If the changes are significant, we will post them here before they take effect.</p>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </Prose>
    </>
  );
}
