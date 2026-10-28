import type { ThemeId } from './types';

export interface ThemeMeta {
  id: ThemeId;
  label: string;
  /** Small swatch shown in the theme picker */
  swatch: string;
}

export const THEMES: ThemeMeta[] = [
  { id: 'liquid-mesh', label: 'Liquid Mesh', swatch: 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-800' },
  { id: 'tokyo-minimal', label: 'Tokyo Minimal', swatch: 'bg-[#fbf9f5] border border-stone-200' },
  { id: 'funk-suburban', label: 'Funk Suburban', swatch: 'bg-[#CCFF00]' },
  { id: 'cyberpunk', label: 'Cyberpunk', swatch: 'bg-zinc-950 border border-cyan-500/50' },
];

export const THEME_IDS = THEMES.map((t) => t.id);

export function getThemeBackground(themeId: ThemeId) {
  switch (themeId) {
    case 'funk-suburban':
      return 'bg-[#CCFF00] text-black bg-[linear-gradient(to_right,#00000012_1px,transparent_1px),linear-gradient(to_bottom,#00000012_1px,transparent_1px)] bg-[size:16px_16px]';
    case 'cyberpunk':
      return 'bg-zinc-950 text-cyan-400';
    case 'tokyo-minimal':
      return 'bg-[#fbf9f5] text-stone-900';
    case 'liquid-mesh':
    default:
      return 'bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-800 text-white';
  }
}

export function getThemeCardStyle(themeId: ThemeId) {
  switch (themeId) {
    case 'funk-suburban':
      return 'bg-white text-black border-2 border-black font-extrabold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-xl';
    case 'cyberpunk':
      return 'bg-zinc-900/90 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400 rounded-xl';
    case 'tokyo-minimal':
      return 'bg-white border border-stone-200 text-stone-900 shadow-sm hover:shadow-md rounded-2xl';
    case 'liquid-mesh':
    default:
      return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-xl';
  }
}

export function getThemeTextColor(themeId: ThemeId) {
  switch (themeId) {
    case 'funk-suburban':
    case 'tokyo-minimal':
      return 'text-black';
    case 'cyberpunk':
      return 'text-cyan-400';
    case 'liquid-mesh':
    default:
      return 'text-white';
  }
}

export function getThemeBioColor(themeId: ThemeId) {
  switch (themeId) {
    case 'funk-suburban':
      return 'text-black/80 font-semibold';
    case 'tokyo-minimal':
      return 'text-stone-700 font-medium';
    case 'cyberpunk':
      return 'text-cyan-400/80';
    case 'liquid-mesh':
    default:
      return 'text-white/80';
  }
}

export function getThemeMutedColor(themeId: ThemeId) {
  return themeId === 'funk-suburban' || themeId === 'tokyo-minimal'
    ? 'text-black/60 hover:text-black'
    : 'text-white/60 hover:text-white';
}
