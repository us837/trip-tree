import type { Metadata } from 'next';
import { PageHero, Prose } from '@/components/site/ui';
import { CONTACT_EMAIL } from '@/src/lib/site';

export const metadata: Metadata = { title: 'Cancellation & Refund Policy' };

export default function RefundPage() {
  return (
    <>
      <PageHero title="Cancellation & Refund Policy">Last updated: 28 October 2026</PageHero>
      <Prose>
        <h2>Cancellation</h2>
        <p>
          You can cancel TripTree Pro at any time from your dashboard or by emailing us. After you cancel you will not
          be charged again, and Pro stays active until the end of the period you have already paid for.
        </p>
        <h2>Refunds</h2>
        <ul>
          <li>
            If you were charged by mistake or charged twice, email us within 7 days and we will refund the full amount.
          </li>
          <li>For a new yearly plan, you can ask for a full refund within 7 days of purchase.</li>
          <li>Monthly plans are not refunded for part of a month.</li>
        </ul>
        <p>
          Approved refunds go back to the original payment method within 5 to 7 working days, depending on your bank.
        </p>
        <h2>Contact</h2>
        <p>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      </Prose>
    </>
  );
}
