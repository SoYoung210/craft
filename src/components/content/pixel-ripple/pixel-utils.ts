import { Pixel } from './types';

// Animation constants
const NUM_BANDS = 8;
const WAVE_WIDTH = 2;
const RANDOM_OFFSET_MULTIPLIER = 1.5;
const PIXEL_APPEARANCE_THRESHOLD = 0.4;

/**
 * Creates a grid of pixels based on container dimensions and settings
 */
export const createPixelGrid = (
  width: number,
  height: number,
  gridSize: number,
  density: number
): Pixel[] => {
  // Calculate pixel size based on larger dimension
  const largerDimension = Math.max(width, height);
  const pixelSize = largerDimension / gridSize;

  // Calculate grid dimensions
  const cols = Math.ceil(width / pixelSize);
  const rows = Math.ceil(height / pixelSize);

  // Create pixels with 1px overlap to prevent gaps
  const pixels: Pixel[] = [];
  const threshold = density / 100;
  const overlap = 1;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Use density to determine if we should create this pixel
      if (Math.random() < threshold) {
        pixels.push({
          x: col * pixelSize,
          y: row * pixelSize,
          size: pixelSize + overlap,
          opacity: 0,
          targetOpacity: 0,
          distance: 0,
          band: 0,
          random: Math.random(),
        });
      }
    }
  }

  return pixels;
};

/**
 * Calculates distance from mouse position and assigns pixels to bands
 */
export const calculatePixelDistances = (
  pixels: Pixel[],
  mouseX: number,
  mouseY: number,
  width: number,
  height: number
): void => {
  // Normalize mouse position
  const normalizedX = mouseX / width;
  const normalizedY = mouseY / height;

  // Update pixel distances
  pixels.forEach(pixel => {
    const pixelCenterX = (pixel.x + pixel.size / 2) / width;
    const pixelCenterY = (pixel.y + pixel.size / 2) / height;

    const dx = pixelCenterX - normalizedX;
    const dy = pixelCenterY - normalizedY;
    pixel.distance = Math.sqrt(dx * dx + dy * dy);

    // Assign to bands (0-7)
    const maxDistance = Math.sqrt(2);
    pixel.band = Math.min(
      Math.floor((pixel.distance / maxDistance) * NUM_BANDS),
      NUM_BANDS - 1
    );
  });

  // Sort pixels by distance for animation
  pixels.sort((a, b) => a.distance - b.distance);
};

/**
 * Updates pixel opacities based on animation progress (forward direction)
 */
export const updatePixelsForward = (pixels: Pixel[], progress: number): void => {
  pixels.forEach(pixel => {
    const bandProgress = progress * (NUM_BANDS + WAVE_WIDTH) - pixel.band;

    // Add random offset to make bands less obvious (-0.5 to +0.5 band range)
    const randomOffset = (pixel.random - 0.5) * RANDOM_OFFSET_MULTIPLIER;
    const adjustedProgress = bandProgress + randomOffset;

    if (adjustedProgress >= 0 && adjustedProgress < WAVE_WIDTH) {
      // Pixel is in the wave - add random variation to appearance
      // Some pixels appear, some don't (60-40 split)
      if (pixel.random > PIXEL_APPEARANCE_THRESHOLD) {
        pixel.opacity = 1;
      } else {
        pixel.opacity = 0;
      }
    } else if (adjustedProgress >= WAVE_WIDTH) {
      // Wave has passed
      pixel.opacity = 0;
    } else {
      // Wave hasn't reached yet
      pixel.opacity = 0;
    }
  });
};

/**
 * Updates pixel opacities based on animation progress (reverse direction)
 */
export const updatePixelsReverse = (pixels: Pixel[], progress: number): void => {
  pixels.forEach(pixel => {
    const reverseBand = NUM_BANDS - 1 - pixel.band;
    const bandProgress = progress * (NUM_BANDS + WAVE_WIDTH) - reverseBand;

    // Add random offset to make bands less obvious
    const randomOffset = (pixel.random - 0.5) * RANDOM_OFFSET_MULTIPLIER;
    const adjustedProgress = bandProgress + randomOffset;

    if (adjustedProgress >= 0 && adjustedProgress < WAVE_WIDTH) {
      // Pixel is in the wave - add random variation to appearance
      if (pixel.random > PIXEL_APPEARANCE_THRESHOLD) {
        pixel.opacity = 1;
      } else {
        pixel.opacity = 0;
      }
    } else if (adjustedProgress >= WAVE_WIDTH) {
      // Wave has passed
      pixel.opacity = 0;
    } else {
      // Wave hasn't reached yet
      pixel.opacity = 0;
    }
  });
};

/**
 * Clears all pixel opacities
 */
export const clearPixels = (pixels: Pixel[]): void => {
  pixels.forEach(pixel => {
    pixel.opacity = 0;
  });
};
