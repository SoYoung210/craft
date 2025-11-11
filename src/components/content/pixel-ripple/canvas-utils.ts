import { Pixel } from './types';

/**
 * Draws all pixels on the canvas
 */
export const drawPixels = (
  canvas: HTMLCanvasElement,
  pixels: Pixel[],
  pixelColor: string
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = parseInt(canvas.style.width || '0');
  const height = parseInt(canvas.style.height || '0');

  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  // Set pixel color
  ctx.fillStyle = pixelColor;

  // Draw each pixel
  pixels.forEach(pixel => {
    if (pixel.opacity > 0.01) {
      ctx.globalAlpha = pixel.opacity;
      ctx.fillRect(
        Math.floor(pixel.x),
        Math.floor(pixel.y),
        Math.ceil(pixel.size),
        Math.ceil(pixel.size)
      );
    }
  });

  ctx.globalAlpha = 1;
};

/**
 * Sets up canvas with proper dimensions and pixel ratio
 */
export const setupCanvas = (
  canvas: HTMLCanvasElement,
  width: number,
  height: number
): void => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;
  }
};
