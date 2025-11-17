export const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uProgress;
  uniform float uSize;

  attribute vec3 aRandom;
  attribute float aDelay;
  attribute float aSize;

  varying float vAlpha;

  float rand(float n) { return fract(sin(n) * 43758.5453123); }

  float noise(vec3 p) {
    return rand(dot(p, vec3(12.9898, 78.233, 37.719)));
  }

  void main() {
    vec3 pos = position;

    // how much this particle should have blown out (0–1)
    float t = clamp((uProgress - aDelay) * 5.0, 0.0, 1.0);

    if (t > 0.0) {
      float n = noise(pos * 3.0 + uTime * 0.5);
      vec3 blowDir = normalize(aRandom) * (t * 5.0);
      vec3 swirl   = normalize(aRandom.yzx) * (n * 2.0 * t);
      pos += blowDir + swirl;
    }

    vAlpha = 1.0 - t;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * aSize * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const fragmentShader = /* glsl */ `
  precision highp float;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.0, d) * vAlpha;

    if (alpha < 0.01) discard;

    // bluish glow
    gl_FragColor = vec4(0.7, 0.9, 1.0, alpha);
  }
`;
