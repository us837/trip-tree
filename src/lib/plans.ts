import type { Plan, ThemeId } from './types';

export interface PlanLimits {
  maxLinks: number;
  themes: ThemeId[];
  analyticsDays: number;
  branding: boolean;
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxLinks: 5,
    themes: ['liquid-mesh', 'tokyo-minimal'],
    analyticsDays: 7,
    branding: true,
  },
  pro: {
    maxLinks: 50,
    themes: ['liquid-mesh', 'funk-suburban', 'cyberpunk', 'tokyo-minimal'],
    analyticsDays: 90,
    branding: false,
  },
};

export const PRO_PRICE = { monthly: 100, yearly: 1000 };

/** Payments are not wired up yet; flip this when Razorpay checkout ships. */
export const PAYMENTS_ENABLED = false;

export function effectivePlan(plan: string, expiresAt: number | null): Plan {
  if (plan !== 'pro') return 'free';
  return expiresAt === null || expiresAt > Date.now() ? 'pro' : 'free';
}
