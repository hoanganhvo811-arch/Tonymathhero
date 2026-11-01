// Central Hero Images Provider (with base64 inlining for 100% offline file:/// compatibility)
import tonyHeroGrade2 from './tony-hero-grade2.jpg';
import tonyHeroGrade3 from './tony-hero-grade3.jpg';
import tonyHeroDefault from './tony-hero.jpg';
import type { CampaignId } from '@/types';

export const HERO_IMAGES = {
  grade2: tonyHeroGrade2,
  grade3: tonyHeroGrade3,
  default: tonyHeroDefault,
};

export function getHeroImage(campaignId?: CampaignId | string): string {
  if (campaignId === 'grade-2') return HERO_IMAGES.grade2;
  if (campaignId === 'grade-3') return HERO_IMAGES.grade3;
  return HERO_IMAGES.default;
}

// Fallback high-res SVG Warrior data-URI in case of any loading edge case
export const HERO_AVATAR_FALLBACK_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
    <linearGradient id="armorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#facc15" />
      <stop offset="100%" stop-color="#eab308" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" stroke="#facc15" stroke-width="3" />
  <!-- Tony Head & Helmet -->
  <circle cx="50" cy="38" r="18" fill="#fed7aa" />
  <!-- Hair / Crest -->
  <path d="M 36 34 Q 50 16 64 34 Q 50 24 36 34 Z" fill="#92400e" />
  <!-- Golden Crown / Headband -->
  <path d="M 34 32 L 66 32 L 62 36 L 38 36 Z" fill="url(#goldGrad)" />
  <polygon points="50,22 46,31 54,31" fill="url(#goldGrad)" />
  <!-- Eyes & Smile -->
  <circle cx="43" cy="38" r="2.5" fill="#1e293b" />
  <circle cx="57" cy="38" r="2.5" fill="#1e293b" />
  <path d="M 44 45 Q 50 49 56 45" stroke="#92400e" stroke-width="2" stroke-linecap="round" fill="none" />
  <!-- Hero Armor & Cape -->
  <path d="M 28 62 Q 50 54 72 62 L 78 92 Q 50 86 22 92 Z" fill="url(#armorGrad)" stroke="#38bdf8" stroke-width="1.5" />
  <!-- Gold Armor Emblem -->
  <polygon points="50,62 43,74 57,74" fill="url(#goldGrad)" />
  <circle cx="50" cy="71" r="3" fill="#ffffff" />
</svg>
`);
