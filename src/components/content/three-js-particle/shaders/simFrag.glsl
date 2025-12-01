uniform sampler2D uPositions;
uniform sampler2D uInfo;
uniform vec2 uMouse;
uniform float time;

varying vec2 vUv;

void main() {
  vec3 pos = texture2D(uPositions, vUv).xyz;
  vec3 info = texture2D(uInfo, vUv).xyz;
  // Rotate particles around center
  float radius = info.x;
  float angle = atan(pos.y, pos.x) + 0.1;

  vec3 targetPos = vec3(cos(angle), sin(angle), 0.0) * radius;
  pos.xy += (targetPos.xy - pos.xy) * 0.1;


  gl_FragColor = vec4(pos, 1.0);
}
