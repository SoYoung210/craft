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
  float angle = atan(pos.y, pos.x);
  vColor = vec4(0.5 + 0.45*sin(angle+time*0.4));
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

  gl_PointSize = 1. * ( 1. / - mvPosition.z );
  gl_Position = projectionMatrix * mvPosition;
}