export type ThemeId = 'liquid-mesh' | 'funk-suburban' | 'cyberpunk' | 'tokyo-minimal';

export type Plan = 'free' | 'pro';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  enabled: boolean;
}

export interface Profile {
  slug: string;
  name: string;
  bio: string;
  /** https URL or a small data:image URI uploaded from the dashboard */
  avatar: string;
  theme: ThemeId;
  links: LinkItem[];
}

export type ProfileInput = Omit<Profile, 'slug'>;

export interface MeResponse {
  user: { email: string; name: string; picture: string; plan: Plan };
  profile: Profile | null;
}

export interface AnalyticsResponse {
  days: number;
  views: { day: string; count: number }[];
  clicks: Record<string, number>;
}
