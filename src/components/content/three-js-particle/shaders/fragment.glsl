uniform sampler2D uPositions;
uniform sampler2D uInfo;
uniform vec2 uMouse;
uniform float time;

varying vec2 vUv;

void main() {

  gl_FragColor = vec4(vUv, 0.0, 1.0);
}
