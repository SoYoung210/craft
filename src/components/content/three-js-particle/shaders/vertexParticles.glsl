uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vColor;
uniform sampler2D uPositions;
float PI = 3.141592653589793238;
void main() {
  vUv = uv;

  // Read actual position from FBO texture
  vec3 pos = texture2D(uPositions, uv).xyz;

  float angle = atan(pos.y, pos.x); // -PI to PI

  // Convert to 0~1 starting at 12 o'clock, going clockwise
  // atan gives: 12 o'clock = PI/2, 3 o'clock = 0, 6 o'clock = -PI/2, 9 o'clock = PI/-PI
  // We want: 12 o'clock = 0, 3 o'clock = 0.25, 6 o'clock = 0.5, 9 o'clock = 0.75
  float angle01 = fract((PI * 0.5 - angle) / (2.0 * PI));

  float duration = 1.5; // animation duration in seconds
  float progress = clamp(time / duration, 0.0, 1.0);

  float edge = 0.15; // softness around both ends of the arc

  // Extend progress slightly above 1.0 so the sweep fully covers the last angles
  float extendedProgress = mix(0.0, 1.0 + edge, progress);

  // Soft fade near the starting seam only during the early phase; fade this helper out as progress -> 1
  float seamFactor = smoothstep(0.0, edge, min(angle01, 1.0 - angle01));
  float seamRelease = smoothstep(1.0 - edge, 1.0, progress);
  float seamBlend  = mix(seamFactor, 1.0, seamRelease);

  // Soft fade for the moving edge of the sweep
  float sweep = smoothstep(angle01 - edge, angle01 + edge, extendedProgress);

  // Final alpha: sweep controls the drawing head, seamBlend prevents a permanent hole at 12 o'clock
  float alpha = sweep * seamBlend;


  float brightness = 1.0 + 0.45*sin(angle+time*0.4);

  vColor = vec4(brightness, brightness, brightness, alpha);


  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = 1. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}
