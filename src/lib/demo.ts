import type { ProfileInput } from './types';

// Sample pages for the marketing site. Fictional people, no external images.
export const DEMO_PROFILES: ProfileInput[] = [
  {
    name: 'Aarav Mehta',
    bio: 'Street photographer · Mumbai · Prints & presets below',
    avatar: '',
    theme: 'funk-suburban',
    links: [
      { id: 'a', title: 'Instagram', url: 'https://instagram.com', enabled: true },
      { id: 'b', title: 'Lightroom presets', url: 'https://gumroad.com', enabled: true },
      { id: 'c', title: 'YouTube: editing tutorials', url: 'https://youtube.com', enabled: true },
      { id: 'd', title: 'Book a shoot', url: 'https://calendly.com', enabled: true },
    ],
  },
  {
    name: 'Riya Kapoor',
    bio: 'Writing about tech, design and slow travel.',
    avatar: '',
    theme: 'liquid-mesh',
    links: [
      { id: 'a', title: 'Read my newsletter', url: 'https://substack.com', enabled: true },
      { id: 'b', title: 'Medium stories', url: 'https://medium.com', enabled: true },
      { id: 'c', title: 'Buy me a coffee', url: 'https://buymeacoffee.com', enabled: true },
    ],
  },
  {
    name: 'Kai Studio',
    bio: 'Open-source tools for developers.',
    avatar: '',
    theme: 'cyberpunk',
    links: [
      { id: 'a', title: 'GitHub', url: 'https://github.com', enabled: true },
      { id: 'b', title: 'Join the Discord', url: 'https://discord.com', enabled: true },
      { id: 'c', title: 'Follow on X', url: 'https://x.com', enabled: true },
    ],
  },
  {
    name: 'Meera Bakes',
    bio: 'Home bakery in Pune. Custom cakes, Thu–Sun.',
    avatar: '',
    theme: 'tokyo-minimal',
    links: [
      { id: 'a', title: 'Order on WhatsApp', url: 'https://wa.me', enabled: true },
      { id: 'b', title: 'Menu & prices', url: 'https://notion.so', enabled: true },
      { id: 'c', title: 'Instagram', url: 'https://instagram.com', enabled: true },
    ],
  },
];
