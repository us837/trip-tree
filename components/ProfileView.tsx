import { getBrandMeta } from '@/src/lib/brands';
import {
  getThemeBackground,
  getThemeBioColor,
  getThemeCardStyle,
  getThemeMutedColor,
  getThemeTextColor,
} from '@/src/lib/themes';
import type { Profile } from '@/src/lib/types';
import { BrandIcon } from './BrandIcon';

interface ProfileViewProps {
  profile: Omit<Profile, 'slug'>;
  showBranding: boolean;
  /** Compact sizing for the phone mockups in the dashboard and marketing pages */
  compact?: boolean;
}

/**
 * The public bio page. Shared by the dashboard preview, the marketing demos and
 * functions/[slug].ts, which renders it to HTML outside Next.js, so it must stay
 * free of hooks and Next-only components.
 */
export function ProfileView({ profile, showBranding, compact = false }: ProfileViewProps) {
  const theme = profile.theme;
  const links = profile.links.filter((l) => l.enabled);
  const initial = (profile.name || '?').trim().charAt(0).toUpperCase();
  const Heading = compact ? 'h2' : 'h1';

  return (
    <div
      className={`w-full flex flex-col items-center text-center ${getThemeBackground(theme)} ${
        compact ? 'min-h-full px-5 pt-12 pb-6' : 'min-h-screen px-4 py-14'
      }`}
    >
      <div className={`w-full flex flex-col items-center ${compact ? '' : 'max-w-md'}`}>
        {profile.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element -- user-supplied URL or data URI
          <img
            src={profile.avatar}
            alt={profile.name}
            className={`${compact ? 'w-20 h-20' : 'w-24 h-24'} rounded-full object-cover border-2 border-black/10 shadow-xl`}
          />
        ) : (
          <div
            className={`${compact ? 'w-20 h-20 text-2xl' : 'w-24 h-24 text-3xl'} rounded-full bg-sun-gradient text-white font-black flex items-center justify-center shadow-xl`}
          >
            {initial}
          </div>
        )}

        <Heading className={`${compact ? 'text-lg' : 'text-2xl'} font-bold mt-4 ${getThemeTextColor(theme)}`}>
          {profile.name || 'Your Name'}
        </Heading>
        {profile.bio && (
          <p className={`${compact ? 'text-xs max-w-[240px]' : 'text-sm'} mt-1 ${getThemeBioColor(theme)}`}>
            {profile.bio}
          </p>
        )}

        <div className={`w-full ${compact ? 'space-y-2.5 mt-6' : 'space-y-3 mt-8'}`}>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              data-link-id={link.id}
              className={`relative flex items-center justify-center w-full font-semibold transition-all duration-200 ${
                compact ? 'p-3 text-xs' : 'p-4 text-sm'
              } ${getThemeCardStyle(theme)}`}
            >
              <BrandIcon brand={getBrandMeta(link.url)} className="absolute left-4 w-4 h-4 opacity-80" />
              <span className="px-6">{link.title || 'Untitled link'}</span>
            </a>
          ))}
        </div>

        {showBranding && (
          // eslint-disable-next-line @next/next/no-html-link-for-pages -- also rendered outside Next.js
          <a href="/" className={`mt-10 text-xs underline transition ${getThemeMutedColor(theme)}`}>
            Made with TripTree · Create yours
          </a>
        )}
      </div>
    </div>
  );
}
