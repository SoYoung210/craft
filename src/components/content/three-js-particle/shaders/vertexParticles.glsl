uniform float time;
varying vec2 vUv;
varying vec3 vPosition;
varying vec4 vColor;
uniform sampler2D uPositions;

void main() {
  // vUv = uv;
    vUv = uv;


    vec4 pos = texture2D( uPositions, uv );

    float angle = atan( pos.y, pos.x );

    vColor = vec4(0.5 + 0.45*sin(angle+time*0.4));
    // vColor = vec4(1.);

    vec4 mvPosition = modelViewMatrix * vec4( vec3(pos.xy,0.), 1. );
    gl_PointSize = 1. * ( 1. / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
