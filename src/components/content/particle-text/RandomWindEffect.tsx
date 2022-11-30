import { useEffect } from 'react';

import useParticleText from './useParticleText';

export default function RandomWindEffect() {
  const [canvasRef, { start }] = useParticleText({
    defaultText: 'Hello World',
    effectDirection: 'random',
  });

  useEffect(() => {
    start();
  }, [start]);

  return <canvas ref={canvasRef} />;
}
