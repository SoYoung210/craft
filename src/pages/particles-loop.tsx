import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { graphql, PageProps } from 'gatsby';

import { Particle2 } from '../components/content/three-js-particle/particle2';
import SEO from '../components/layout/SEO';

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
        <Particle2 />
      </Canvas>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center">
        <h1 className="text-4xl font-light tracking-wide uppercase bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
          Particles Loop
        </h1>
      </div>
    </div>
  );
}

export const Head = (props: PageProps<Queries.PageDataQuery>) => {
  return (
    <SEO
      title="Particles Loop"
      description="December 2025"
      thumbnailSrc={
        props.data.pageFeatured?.childImageSharp?.gatsbyImageData.images
          .fallback?.src
      }
    />
  );
};

export const query = graphql`
  query ParticlesLoopPageData {
    pageFeatured: file(
      absolutePath: { glob: "**/src/images/thumbnails/particles-loop.webp" }
    ) {
      childImageSharp {
        gatsbyImageData(layout: FIXED, width: 900)
      }
    }
  }
`;
