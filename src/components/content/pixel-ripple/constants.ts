// Hover effect types
export type HoverEffectType = 'scanlines' | 'chromaticAberration' | 'none';

// Chromatic Aberration configurations
export const CHROMATIC_CONFIG = {
  duration: 400, // ms for effect

  // Intensity presets
  intensity: {
    low: 3,
    medium: 6,
    high: 10,
  },

  // RGB channel offsets
  offsets: {
    low: { r: -2, g: 0, b: 2 },
    medium: { r: -4, g: 0, b: 4 },
    high: { r: -8, g: 0, b: 8 },
  },

  // Effects toggles
  enableNoise: true,
  enableGlitch: true,
};

// Scanline color configurations
export const SCANLINE_COLORS = {
  green: {
    filter: 'hue-rotate(120deg) saturate(1.5) brightness(1.2)',
    color: 'rgba(0, 255, 0, 0.1)',
  },
  amber: {
    filter: 'hue-rotate(30deg) saturate(2) brightness(1.1)',
    color: 'rgba(255, 191, 0, 0.1)',
  },
  white: {
    filter: 'brightness(1.2)',
    color: 'rgba(255, 255, 255, 0.1)',
  },
  none: {
    filter: 'none',
    color: 'transparent',
  },
};
