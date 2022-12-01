import { useEffect } from 'react';

import { styled } from '../../../../stitches.config';
import Text from '../../material/Text';

import useParticleText from './useParticleText';

export default function SnowFlake() {
  const [canvasRef, { start }] = useParticleText({
    defaultText: 'so-so.dev 🎄🧦',
    effectDirection: 'top',
    colorSet: [
      `rgba(240,243,255, ${Math.random()})`,
      `rgba(227,230,255, ${Math.random()})`,
      `rgba(207,211,255, ${Math.random()})`,
      `rgba(190,193,246, ${Math.random()})`,
    ],
  });

  useEffect(() => {
    start();
  }, [start]);

  return (
    <Root>
      <canvas style={{ backgroundColor: 'black' }} ref={canvasRef} />
      <Text color="gray0" asChild>
        <a href="https://so-so.dev" target="_blank" rel="noreferrer" />
      </Text>
    </Root>
  );
}

const Root = styled('div', {
  position: 'relative',

  '& canvas': {
    width: '100%',
    height: '100%',
  },

  '& a': {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  },
});
