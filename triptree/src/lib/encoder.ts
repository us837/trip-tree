import LZString from 'lz-string';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
}

export interface UserProfile {
  name: string;
  bio: string;
  avatarUrl: string;
  themeId: 'liquid-mesh' | 'funk-suburban' | 'cyberpunk' | 'tokyo-minimal';
  links: LinkItem[];
}

export function encodeState(data: UserProfile): string {
  const json = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(json);
}

export function decodeState(hash: string): UserProfile | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(hash);
    return json ? JSON.parse(json) : null;
  } catch (err) {
    console.error('Failed to decode payload:', err);
    return null;
  }
}