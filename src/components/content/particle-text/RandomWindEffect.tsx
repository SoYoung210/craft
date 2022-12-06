import { useEffect } from 'react';

import useParticleText from './useParticleText';

interface Props {
  textValue: string;
}
export default function RandomWindEffect({ textValue }: Props) {
  const [canvasRef, { start }] = useParticleText({
    defaultText: textValue,
    effectDirection: 'random',
  });

  useEffect(() => {
    start();
  }, [start]);

  return <canvas style={{ backgroundColor: 'black' }} ref={canvasRef} />;
}
