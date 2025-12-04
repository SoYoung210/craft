import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

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
        {/* <OrbitControls
          enablePan={true}
          minDistance={1}
          maxDistance={15}
          target={[0, 0, 0]}
        /> */}
      </Canvas>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
        <h1 className="text-4xl font-light tracking-wide uppercase bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Particles Loop
        </h1>
      </div>
    </div>
  );
}
