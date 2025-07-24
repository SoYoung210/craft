import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import LiquidText from '../components/content/liquid-text/LiquidText';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function LiquidTextPage() {
  return (
    <>
      <PageLayout.Title>Liquid Text</PageLayout.Title>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 45 }}
        style={{ height: '80vh' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls enableZoom enableRotate />
        <LiquidText text="Soyoung" />
      </Canvas>
    </>
  );
}
/**
 *  const font = useLoader(FontLoader, '/fonts/helvetiker_regular.typeface.json');
 *   const geometry = useMemo(() => {
    if (!font) return null;
    return new TextGeometry(text, {
      font,
      size: fontSize,
      depth: 0.2,
      curveSegments: 8,
      bevelEnabled: false,
    });
  }, [font, text, fontSize]);

 */
