import { useRef, useState, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_scale;
  uniform vec3 u_color1, u_color2, u_color3, u_color4;

  float cheapNoise(vec3 stp, float ax, float ay, float az, float aw) {
    vec3 p = vec3(stp.st, stp.p);
    vec4 a = vec4(ax, ay, az, aw);
    return mix(
      sin(p.z + p.x * a.x + cos(p.x * a.x - p.z)) *
      cos(p.z + p.y * a.y + cos(p.y * a.x + p.z)),
      sin(1. + p.x * a.z + p.z + cos(p.y * a.w - p.z)) *
      cos(1. + p.y * a.w + p.z + cos(p.x * a.x + p.z)),
      .436
    );
  }

  void main() {
    float ax = 5.0, ay = 7.0, az = 9.0, aw = 13.0;
    float bx = 1.0, by = 1.0;
    vec2 st = vUv * u_scale;
    float S = sin(u_time * .005);
    float C = cos(u_time * .005);
    vec2 v1 = vec2(cheapNoise(vec3(st, 2.), ax, ay, az, aw), cheapNoise(vec3(st, 1.), ax, ay, az, aw));
    vec2 v2 = vec2(
      cheapNoise(vec3(st + bx*v1 + vec2(C * 1.7, S * 9.2), 0.15 * u_time), ax, ay, az, aw),
      cheapNoise(vec3(st + by*v1 + vec2(S * 8.3, C * 2.8), 0.126 * u_time), ax, ay, az, aw)
    );
    float n = .5 + .5 * cheapNoise(vec3(st + v2, 0.), ax, ay, az, aw);

    vec3 color = mix(u_color1, u_color2, clamp((n*n)*8.,0.0,1.0));
    color = mix(color, u_color3, clamp(length(v1),0.0,1.0));
    color = mix(color, u_color4, clamp(length(v2.x),0.0,1.0));
    // color /= n*n + n * 7.; // Try commenting this out or reducing the divisor
    color *= 1.05; // Increase brightness
    color = clamp(color, 0.0, 1.0); // Prevent overflow
    gl_FragColor = vec4(color, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

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
      u_time: { value: 0 },
      u_scale: { value: 0.4 },
      u_color1: { value: new THREE.Color('#ffffff') },
      u_color2: { value: new THREE.Color('#ffafaf') },
      u_color3: { value: new THREE.Color('#0099ff') },
      u_color4: { value: new THREE.Color('#ffffff') },
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
