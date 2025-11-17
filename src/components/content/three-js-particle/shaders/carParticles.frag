precision highp float;
varying float vAlpha;
varying float vProgress;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);

  // Crisp circular particles
  float circle = 1.0 - smoothstep(0.3, 0.5, d);
  float alpha = circle * vAlpha;

  if (alpha < 0.01) discard;

  // Bright white/cyan particles like the reference
  vec3 baseColor = vec3(0.8, 0.95, 1.0); // Bright cyan-white

  // Add intense bright core for visibility
  float core = 1.0 - smoothstep(0.0, 0.3, d);
  vec3 color = mix(baseColor, vec3(1.0), core * 0.8);

  // Boost brightness overall
  color *= 1.5;

  gl_FragColor = vec4(color, alpha);
}
