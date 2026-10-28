import { Globe, Mail, Phone } from 'lucide-react';
import type { BrandInfo } from '@/src/lib/brands';

/** Renders a brand glyph in currentColor so it adapts to whatever theme it sits on. */
export function BrandIcon({ brand, className = 'w-4 h-4' }: { brand: BrandInfo; className?: string }) {
  if (brand.path) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d={brand.path} />
      </svg>
    );
  }
  if (brand.name === 'Email') return <Mail className={className} aria-hidden="true" />;
  if (brand.name === 'Phone') return <Phone className={className} aria-hidden="true" />;
  return <Globe className={className} aria-hidden="true" />;
}
