import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

import { CarParticles } from '../components/content/three-js-particle/three-js-particle';

export default function ThreeJsParticlePage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [3, 1, 4], fov: 50 }}
        gl={{ antialias: true }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0x000000); // black bg
        }}
      >
        <CarParticles count={100000} />
        <OrbitControls
          enablePan={false}
          minDistance={2}
          maxDistance={10}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
