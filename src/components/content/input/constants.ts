export interface TagItem {
  slug: string;
  label: string;
}

export const DEFAULT_TAGS: TagItem[] = [
  { slug: 'design', label: 'Design' },
  { slug: 'motion', label: 'Motion' },
  { slug: 'typography', label: 'Typography' },
  { slug: 'interaction', label: 'Interaction' },
  { slug: 'layout', label: 'Layout' },
  { slug: 'color', label: 'Color' },
  { slug: 'prototyping', label: 'Prototyping' },
  { slug: 'accessibility', label: 'Accessibility' },
  { slug: 'responsive', label: 'Responsive' },
  { slug: 'animation', label: 'Animation' },
];

export const ROTATIONS = [-1, 1.5, -2, 1, -1.5, 2, -1, 1.5, -2, 1, -1.5, 2];

export const MORPH_TRANSITION = {
  type: 'spring' as const,
  duration: 0.4,
  bounce: 0,
};
