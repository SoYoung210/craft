import { CSSProperties } from 'react';
import { CHROMATIC_CONFIG, SCANLINE_COLORS } from './constants';

export const createScanlineStyles = (
  isHovered: boolean,
  hoverEffect: string,
  scanlineColor: 'green' | 'amber' | 'white' | 'none'
): CSSProperties => {
  const filter =
    scanlineColor && SCANLINE_COLORS[scanlineColor]
      ? SCANLINE_COLORS[scanlineColor].filter
      : 'none';

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0) 0px,
        rgba(0, 0, 0, 0.05) 1px,
        rgba(0, 0, 0, 0) 2px,
        rgba(0, 0, 0, 0) 3px
      )
    `,
    opacity: isHovered && hoverEffect === 'scanlines' ? 1 : 0,
    transition: 'opacity 0.2s ease-in-out',
    pointerEvents: 'none' as const,
    zIndex: 4,
    mixBlendMode: 'multiply' as const,
    filter,
  };
};

export const createMovingScanlineStyles = (
  isHovered: boolean,
  hoverEffect: string,
  scanlineColor: 'green' | 'amber' | 'white' | 'none'
): CSSProperties => {
  const filter =
    scanlineColor && SCANLINE_COLORS[scanlineColor]
      ? SCANLINE_COLORS[scanlineColor].filter
      : 'none';

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background:
      'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
    opacity: isHovered && hoverEffect === 'scanlines' ? 0.8 : 0,
    pointerEvents: 'none' as const,
    zIndex: 5,
    filter,
    animation:
      isHovered && hoverEffect === 'scanlines'
        ? 'scanline 3s linear infinite'
        : 'none',
  };
};

export const createFlickerStyles = (
  isHovered: boolean,
  hoverEffect: string
): CSSProperties => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.02)',
    opacity: isHovered && hoverEffect === 'scanlines' ? 1 : 0,
    pointerEvents: 'none' as const,
    zIndex: 6,
    animation:
      isHovered && hoverEffect === 'scanlines'
        ? 'flicker 0.15s infinite'
        : 'none',
  };
};

export const createChromaticOverlayStyles = (
  showChromatic: boolean
): CSSProperties => {
  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: showChromatic ? 1 : 0,
    transition: `opacity ${CHROMATIC_CONFIG.duration}ms ease-in-out`,
    pointerEvents: 'none' as const,
    zIndex: 7,
  };
};

export const getScanlineColorFilter = (
  scanlineColor: 'green' | 'amber' | 'white' | 'none'
): string => {
  if (scanlineColor && SCANLINE_COLORS[scanlineColor]) {
    return SCANLINE_COLORS[scanlineColor].filter;
  }
  return 'none';
};

export const getContentFilter = (
  isHovered: boolean,
  hoverEffect: string,
  enableScanlines: boolean,
  scanlineColor: 'green' | 'amber' | 'white' | 'none'
): string => {
  if (!isHovered) return 'none';

  // Apply scanline color filter
  if (hoverEffect === 'scanlines' && enableScanlines) {
    return getScanlineColorFilter(scanlineColor);
  }

  return 'none';
};
