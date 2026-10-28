import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/site/ui';
import { PLAN_LIMITS } from '@/src/lib/plans';
import { CONTACT_EMAIL, SITE_HOST } from '@/src/lib/site';

export const metadata: Metadata = {
  title: 'Guide',
  description: 'How to set up, customise and share your TripTree page, step by step.',
};

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: 'sign-in',
    title: '1. Sign in',
    body: (
      <>
        <p>
          Go to <Link href="/login">Log in</Link> and choose <strong>Continue with Google</strong>. TripTree only gets
          your name, email address and profile photo. There is no separate password to remember.
        </p>
      </>
    ),
  },
  {
    id: 'username',
    title: '2. Claim your username',
    body: (
      <>
        <p>
          The first time you sign in, you will be asked to pick a username. Your page will live at{' '}
          <code>{SITE_HOST}/yourname</code>.
        </p>
        <ul>
          <li>3 to 30 characters: lowercase letters, numbers, <code>-</code> and <code>_</code>.</li>
          <li>It has to start and end with a letter or a number.</li>
          <li>
            You can change it later under <strong>Settings</strong>. Your old link and QR code will stop working, so
            update them wherever you shared them.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'profile',
    title: '3. Set up your profile',
    body: (
      <>
        <p>In the <strong>Editor</strong> tab, fill in:</p>
        <ul>
          <li><strong>Name:</strong> your name or brand, shown in large text at the top.</li>
          <li><strong>Bio:</strong> one or two lines about you, up to 160 characters.</li>
          <li>
            <strong>Photo:</strong> your Google photo is used to start with. Click <strong>Upload</strong> to use a
            different picture (it is resized for you), or paste an <code>https://</code> image link.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'links',
    title: '4. Add your links',
    body: (
      <>
        <p>
          Click <strong>Add link</strong>, give it a title (the text on the button) and paste the address. You can leave
          out <code>https://</code> and TripTree adds it for you.
        </p>
        <ul>
          <li>Drag the handle on the left to change the order.</li>
          <li>Use the eye icon to hide a link without deleting it.</li>
          <li>
            Email and phone links work too: <code>mailto:you@example.com</code> or <code>tel:+919876543210</code>.
          </li>
          <li>The Free plan allows {PLAN_LIMITS.free.maxLinks} links. Pro allows {PLAN_LIMITS.pro.maxLinks}.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'themes',
    title: '5. Choose a theme',
    body: (
      <p>
        Pick a theme under <strong>Theme</strong> and the phone preview on the right updates straight away. Liquid
        Mesh and Tokyo Minimal are free. Funk Suburban and Cyberpunk need Pro.
      </p>
    ),
  },
  {
    id: 'publish',
    title: '6. Save and share',
    body: (
      <>
        <p>
          Click <strong>Save</strong>. Your page is live as soon as it saves. There is no separate publish step. Click{' '}
          <strong>Share</strong> to copy your link or download your QR code.
        </p>
        <ul>
          <li><strong>Instagram:</strong> Edit profile → Links → Add external link.</li>
          <li><strong>YouTube:</strong> Customise channel → Basic info → Links.</li>
          <li><strong>X:</strong> Edit profile → Website.</li>
          <li><strong>WhatsApp Business:</strong> Settings → Business tools → Profile → Website.</li>
        </ul>
        <p>
          Your QR code always points to your page, so you never need to reprint it when your links change. You only
          need a new one if you change your username.
        </p>
      </>
    ),
  },
  {
    id: 'analytics',
    title: '7. Read your analytics',
    body: (
      <p>
        The <strong>Analytics</strong> tab shows views of your page per day and how many times each link was tapped.
        Free covers the last {PLAN_LIMITS.free.analyticsDays} days and Pro the last {PLAN_LIMITS.pro.analyticsDays}{' '}
        days. Your own visits count too, and numbers update right away.
      </p>
    ),
  },
];

const FAQ = [
  {
    q: 'My link shows "This page doesn\'t exist yet".',
    a: 'Make sure you saved at least once after claiming your username, and that the address matches your username exactly.',
  },
  {
    q: 'My photo does not show.',
    a: 'Pasted image links must start with https:// and be publicly reachable. Uploading the image instead is the most reliable option.',
  },
  {
    q: 'Can I have more than one page?',
    a: 'Right now each Google account has one TripTree page.',
  },
  {
    q: 'How do I delete my account?',
    a: `Email ${CONTACT_EMAIL} from the address you sign in with and we will delete your account and page.`,
  },
];

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow="Resources" title="Getting started with TripTree">
        Everything you need to set up your page and share it, in about five minutes.
      </PageHero>

      <div className="px-4 max-w-6xl mx-auto grid lg:grid-cols-[220px_1fr] gap-10 items-start">
        <nav className="hidden lg:block sticky top-28 space-y-1 text-sm">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="block px-3 py-2 rounded-lg text-zinc-600 hover:bg-white hover:text-ink">
              {s.title}
            </a>
          ))}
          <a href="#faq" className="block px-3 py-2 rounded-lg text-zinc-600 hover:bg-white hover:text-ink">
            FAQ
          </a>
        </nav>

        <div className="space-y-6">
          {SECTIONS.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="scroll-mt-28 bg-white rounded-3xl border border-black/5 p-8 space-y-3 text-zinc-700 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-grape-600 [&_a]:underline [&_code]:bg-zinc-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_strong]:text-ink"
            >
              <h2 className="text-2xl font-bold text-ink">{s.title}</h2>
              {s.body}
            </section>
          ))}

          <section id="faq" className="scroll-mt-28 bg-white rounded-3xl border border-black/5 p-8">
            <h2 className="text-2xl font-bold mb-4">FAQ</h2>
            <dl className="space-y-5">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <dt className="font-semibold">{f.q}</dt>
                  <dd className="mt-1 text-zinc-600">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
    </>
  );
}
