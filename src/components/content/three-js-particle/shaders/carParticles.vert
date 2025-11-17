uniform float uTime;
uniform float uProgress;
uniform float uSize;

attribute vec3 aRandom;
attribute float aDelay;
attribute float aSize;

varying float vAlpha;
varying float vProgress;

float rand(float n) { return fract(sin(n) * 43758.5453123); }

float noise(vec3 p) {
  return rand(dot(p, vec3(12.9898, 78.233, 37.719)));
}

void main() {
  vec3 pos = position;

  // Individual particle progress with delay
  float particleProgress = clamp((uProgress - aDelay) * 2.0, 0.0, 1.0);
  vProgress = particleProgress;

  // Explosive outward motion
  if (particleProgress > 0.0) {
    // Add turbulent noise for more organic movement
    float n1 = noise(pos * 5.0 + uTime * 0.3);
    float n2 = noise(pos * 3.0 - uTime * 0.5);

    // Exponential explosion for dramatic effect
    float explosionStrength = pow(particleProgress, 1.5) * 8.0;

    // Main explosion direction (outward from car surface)
    vec3 blowDir = normalize(aRandom) * explosionStrength;

    // Add turbulent motion
    vec3 turbulence = vec3(
      sin(n1 * 6.28) * 0.5,
      cos(n2 * 6.28) * 0.5,
      sin(n1 * n2 * 6.28) * 0.5
    ) * particleProgress;

    pos += blowDir + turbulence;
  }

  // Keep particles fully visible when at rest, fade out during explosion
  if (particleProgress <= 0.0) {
    vAlpha = 1.0; // Fully visible at rest
  } else {
    vAlpha = 1.0 - pow(particleProgress, 1.5); // Fade out as they explode
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  // Particles grow slightly as they explode
  float sizeMultiplier = 1.0 + particleProgress * 0.5;
  gl_PointSize = uSize * aSize * sizeMultiplier * (1.0 / -mvPosition.z);
  gl_Position = projectionMatrix * mvPosition;
}
