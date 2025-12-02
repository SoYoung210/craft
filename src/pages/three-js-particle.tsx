import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';

import { CarParticles } from '../components/content/three-js-particle/three-js-particle';
import { Particle2 } from '../components/content/three-js-particle/particle2';

export default function ThreeJsParticlePage() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 70, near: 0.01 }}
        gl={{ antialias: true }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color(0x000000); // black bg
        }}
      >
        {/* <CarParticles count={150000} /> */}
        <Particle2 />
        <OrbitControls
          enablePan={true}
          minDistance={1}
          maxDistance={15}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}
