// ============================================
// UNIFORMS - Values passed from JavaScript
// ============================================
uniform float uTime;      // Current elapsed time
uniform float uProgress;  // Explosion progress (-1 = not exploding, 0-1 = exploding)
uniform float uSize;      // Base particle size
uniform float uEntrance;  // Entrance animation progress (0 = shaking, 1 = settled)

// ============================================
// ATTRIBUTES - Per-particle data
// ============================================
attribute vec3 aScattered; // Scattered starting position for morphing
attribute vec3 aRandom;    // Random direction for each particle (x,y,z from -1 to 1)
attribute float aDelay;    // Random delay for each particle (0 to 1)
attribute float aSize;     // Random size multiplier for each particle

// ============================================
// VARYINGS - Pass data to fragment shader
// ============================================
varying float vAlpha;     // Particle opacity (0 to 1)
varying float vProgress;  // Pass explosion progress to fragment shader

// ============================================
// UTILITY FUNCTIONS
// ============================================
// Generate pseudo-random number from input
float rand(float n) {
  return fract(sin(n) * 43758.5453123);
}

// Generate noise from 3D position
float noise(vec3 p) {
  return rand(dot(p, vec3(12.9898, 78.233, 37.719)));
}

// Smooth easing function (slow start and end)
float easeOutCubic(float t) {
  return 1.0 - pow(1.0 - t, 3.0);
}

// ============================================
// MAIN FUNCTION - Runs once per particle
// ============================================
void main() {
  // Start with original particle position (car shape)
  vec3 pos = position;

  // ============================================
  // ENTRANCE ANIMATION - Water wave ripple effect
  // ============================================
  if (uEntrance < 1.0) {
    // Calculate individual particle's entrance progress with staggered timing
    float entranceProgress = clamp((uEntrance - aDelay * 0.4) * 1.6, 0.0, 1.0);
    float easedEntrance = easeOutCubic(entranceProgress);

    // WATER WAVE TECHNIQUE: Multiple sine waves propagating through space
    // Key idea: waves move through the particle field based on position + time

    // Wave 1: Primary horizontal wave (travels in X direction)
    float wave1Freq = 0.8;  // How many waves per unit
    float wave1Speed = 2.0; // How fast wave travels
    float wave1Amp = 1.5;   // Wave height
    float wave1 = sin(position.x * wave1Freq + uTime * wave1Speed) * wave1Amp;

    // Wave 2: Secondary wave (travels in Z direction)
    float wave2Freq = 1.2;
    float wave2Speed = 1.5;
    float wave2Amp = 1.0;
    float wave2 = sin(position.z * wave2Freq + uTime * wave2Speed) * wave2Amp;

    // Wave 3: Diagonal wave (travels in XZ plane)
    float wave3Freq = 0.6;
    float wave3Speed = 1.8;
    float wave3Amp = 0.8;
    float wave3 = sin((position.x + position.z) * wave3Freq + uTime * wave3Speed) * wave3Amp;

    // Wave 4: Circular ripples from center (like dropping stone in water)
    float distFromCenter = length(position.xz); // Distance in XZ plane
    float rippleFreq = 1.5;
    float rippleSpeed = 2.5;
    float rippleAmp = 1.2;
    float ripple = sin(distFromCenter * rippleFreq - uTime * rippleSpeed) * rippleAmp;

    // Combine all waves with phase offsets per particle for variation
    float phaseOffset = aDelay * 6.28; // Each particle has unique phase
    float combinedWave =
      sin(wave1 + phaseOffset) * 0.3 +
      sin(wave2 + phaseOffset * 1.5) * 0.25 +
      sin(wave3 + phaseOffset * 0.8) * 0.2 +
      sin(ripple + phaseOffset * 1.2) * 0.25;

    // Wave strength decreases as particles settle
    float waveStrength = (1.0 - easedEntrance);

    // Apply wave displacement - primarily in Y (vertical) like water surface
    // But also add XZ displacement for more organic flow
    vec3 waveOffset = vec3(
      combinedWave * 0.5 * waveStrength,      // Subtle X movement
      combinedWave * 1.5 * waveStrength,      // Strong Y movement (main wave)
      combinedWave * 0.5 * waveStrength       // Subtle Z movement
    );

    // Add high-frequency turbulence for water-like detail
    float turbulence =
      sin(position.x * 3.0 + uTime * 3.0 + aDelay * 10.0) * 0.3 +
      cos(position.z * 2.5 + uTime * 2.5 + aDelay * 8.0) * 0.25;

    waveOffset.y += turbulence * waveStrength;

    // Apply wave motion to scattered position BEFORE interpolation
    vec3 wavyScattered = aScattered + waveOffset;

    // Interpolate from wavy scattered position to final car shape
    pos = mix(wavyScattered, position, easedEntrance);
  }

  // ============================================
  // IDLE ANIMATION - Subtle breathing after settled
  // ============================================
  if (uEntrance >= 1.0 && uProgress <= 0.0) {
    // Generate noise based on particle position (makes each particle unique)
    float idleNoise = noise(position * 3.0);
    float idleNoise2 = noise(position * 2.0 + 100.0);

    // Very subtle floating motion to keep particles alive
    pos += vec3(
      sin(uTime * 0.5 + idleNoise * 6.28) * 0.015,
      cos(uTime * 0.4 + idleNoise * 4.0) * 0.01,
      sin(uTime * 0.45 + idleNoise2 * 5.0) * 0.015
    );
  }

  // ============================================
  // EXPLOSION ANIMATION - Click effect
  // ============================================
  // Calculate explosion progress for this particle with staggered timing
  float particleProgress = clamp((uProgress - aDelay) * 2.0, 0.0, 1.0);
  vProgress = particleProgress;  // Pass to fragment shader

  if (particleProgress > 0.0) {
    // Generate turbulent noise for organic explosion
    float n1 = noise(pos * 5.0 + uTime * 0.3);
    float n2 = noise(pos * 3.0 - uTime * 0.5);

    // Exponential strength for dramatic effect
    float explosionStrength = pow(particleProgress, 1.5) * 8.0;

    // Explode outward in random direction (from aRandom attribute)
    vec3 blowDir = normalize(aRandom) * explosionStrength;

    // Add chaotic turbulence
    vec3 turbulence = vec3(
      sin(n1 * 6.28) * 0.5,
      cos(n2 * 6.28) * 0.5,
      sin(n1 * n2 * 6.28) * 0.5
    ) * particleProgress;

    pos += blowDir + turbulence;
  }

  // ============================================
  // PARTICLE OPACITY (Alpha)
  // ============================================
  // Fade in during entrance animation with staggered timing
  float entranceAlpha = clamp((uEntrance - aDelay * 0.3) * 2.0, 0.0, 1.0);

  if (particleProgress <= 0.0) {
    vAlpha = entranceAlpha;  // Just entrance fade
  } else {
    // Fade out during explosion
    vAlpha = entranceAlpha * (1.0 - pow(particleProgress, 1.5));
  }

  // ============================================
  // FINAL TRANSFORMATIONS
  // ============================================
  // Transform position to camera space
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // Calculate particle size (grows during explosion, scales with distance)
  float sizeMultiplier = 1.0 + particleProgress * 0.5;
  gl_PointSize = uSize * aSize * sizeMultiplier * (1.0 / -mvPosition.z);

  // Transform to screen space (built-in output variable)
  gl_Position = projectionMatrix * mvPosition;
}
