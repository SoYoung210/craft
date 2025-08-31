import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying float vBlob;

  uniform float u_scale;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vUv = uv;

    float n = noise(uv * 8.0 * u_scale) * 0.5 + 0.5;
    float s = sin(uv.y * 20.0 * u_scale) * 0.15;
    float blob = n * 0.12 + s * 0.08;

    vBlob = blob;

    vec3 newPosition = position + normal * blob;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  varying float vBlob;

  uniform vec3 u_color1;
  uniform vec3 u_color2;
  uniform vec3 u_color3;
  uniform float u_scale;

  void main() {
    float iridescence = 0.5 + 0.5 * sin(vUv.x * 10.0 * u_scale + vUv.y * 10.0 * u_scale);
    vec3 color = mix(u_color1, u_color2, iridescence);
    color = mix(color, u_color3, smoothstep(0.3, 0.7, vUv.y + vBlob * 0.5));

    float highlight = pow(1.0 - abs(vUv.y - 0.5 + vBlob * 0.2), 8.0);
    color += vec3(1.0, 1.0, 1.0) * highlight * 0.5;

    float alpha = smoothstep(0.0, 0.08, vBlob + 0.08);

    gl_FragColor = vec4(color, alpha);
  }
`;

// TODO: 일단 여기서 모양을 좀 흐르는 링크처럼 바꾸고
// 그다음엔 마우스 반응을 좀 해볼까?
function InkTextShader({ text = 'Horizon' }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [fontJson, setFontJson] = useState(null);

  useEffect(() => {
    fetch('/fonts/pinklatte_regular.typeface.json')
      .then(res => res.json())
      .then(data => setFontJson(data));
  }, []);

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = clock.getElapsedTime();
    }
  });

  const uniforms = useMemo(
    () => ({
      u_scale: { value: 1.0 },
      u_color1: { value: new THREE.Color('#1a237e') }, // deep blue ink
      u_color2: { value: new THREE.Color('#00eaff') }, // cyan
      u_color3: { value: new THREE.Color('#d500f9') }, // magenta
    }),
    []
  );

  return (
    <Center>
      <Environment files="/hdr/pink_sunrise_4k.hdr" background={false} />
      {fontJson && (
        <Text3D
          font={fontJson}
          size={1}
          height={0.01}
          bevelEnabled
          bevelThickness={0.03}
          bevelSize={0.02}
          bevelSegments={5}
          curveSegments={32}
        >
          {text}
          <shaderMaterial
            ref={materialRef}
            uniforms={uniforms}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
          />
          {/* <meshStandardMaterial
            metalness={1}
            roughness={0.05}
            envMapIntensity={1.5}
          /> */}
        </Text3D>
      )}
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh> */}
    </Center>
  );
}

export default InkTextShader;
