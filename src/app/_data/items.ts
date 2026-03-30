export interface CraftItem {
  title: string;
  href: string;
  thumbnail: string;
  aspectRatio: string;
  backgroundColor?: string;
  objectFit?: 'cover' | 'contain';
  date?: string;
}

export const ITEMS: CraftItem[] = [
  {
    title: 'Ripple Shader',
    href: '/ripple-shader',
    thumbnail: '/thumbnails/ripple_og.webp',
    aspectRatio: '3/2',
    backgroundColor: '#0a0a0a',
    date: 'Mar 2026',
  },
  {
    title: 'Particles Loop',
    href: '/particles-loop',
    thumbnail: '/thumbnails/particles-loop.webp',
    aspectRatio: '2/1',
    backgroundColor: '#000',
    date: 'Mar 2026',
  },
  {
    title: 'Pixel Ripple',
    href: '/pixel-ripple',
    thumbnail: '/thumbnails/pixel-ripple.webp',
    aspectRatio: '5/2',
    backgroundColor: '#d6dbdc',
    objectFit: 'contain',
    date: 'Mar 2026',
  },
  {
    title: 'Timezone Clock',
    href: '/timezone-clock',
    thumbnail: '/thumbnails/clock-thumbanil-5.webp',
    aspectRatio: '2/1',
    backgroundColor: '#f5f5f7',
    objectFit: 'contain',
    date: 'Mar 2026',
  },
  {
    title: 'Dynamic Island TOC',
    href: '/dynamic-island-toc',
    thumbnail: '/thumbnails/dynamic-island-toc.webp',
    aspectRatio: '5/2',
    backgroundColor: '#ffffff',
    date: 'Mar 2026',
  },
  {
    title: 'Particle Effect',
    href: '/particle-effect',
    thumbnail: '/thumbnails/particle-effect.webp',
    aspectRatio: '16/9',
    backgroundColor: '#f5f5f5',
    objectFit: 'contain',
    date: 'Mar 2026',
  },
  {
    title: 'Radial Menu',
    href: '/radial-menu',
    thumbnail: '/thumbnails/radial-menu.jpeg',
    aspectRatio: '16/9',
    backgroundColor: '#f8f8f8',
    date: 'Mar 2026',
  },
  {
    title: 'Switch Tab',
    href: '/switch-tab',
    thumbnail: '/thumbnails/switch-tab-1.jpg',
    aspectRatio: '5/2',
    backgroundColor: '#eff0f5',
    date: 'Mar 2026',
  },
  {
    title: 'Glow Cursor List',
    href: '/glow-cursor-list',
    thumbnail: '/thumbnails/glow-cursor.jpg',
    aspectRatio: '8/3',
    backgroundColor: '#f4f4f5',
    date: 'Mar 2026',
  },
  {
    title: 'Floating Video',
    href: '/floating-video',
    thumbnail: '/thumbnails/floating-video.jpg',
    aspectRatio: '8/5',
    backgroundColor: '#a3b1c6',
    objectFit: 'contain',
    date: 'Mar 2026',
  },
  {
    title: 'Link Preview',
    href: '/link-preview',
    thumbnail: '/thumbnails/link_preview.jpg',
    aspectRatio: '16/9',
    backgroundColor: '#e5e5e5',
    objectFit: 'contain',
    date: 'Mar 2026',
  },
  {
    title: 'Dynamic Card',
    href: '/dynamic-card',
    thumbnail: '/thumbnails/dynamic-card.png',
    aspectRatio: '3/2',
    backgroundColor: '#f0f0f0',
    objectFit: 'contain',
    date: 'Mar 2026',
  },
  {
    title: 'Border Animation',
    href: '/border-animation',
    thumbnail: '/thumbnails/border-animation.jpg',
    aspectRatio: '5/3',
    backgroundColor: '#1a1a1a',
    date: 'Mar 2026',
  },
  {
    title: 'Blurred Logo',
    href: '/blurred-logo',
    thumbnail: '/thumbnails/blurred-logo.png',
    aspectRatio: '8/5',
    backgroundColor: '#fafafa',
    objectFit: 'contain',
    date: 'Mar 2026',
  },
];

export function distributeToColumns<T>(items: T[], count: number): T[][] {
  const cols: T[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}
