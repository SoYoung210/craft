import { forwardRef, useImperativeHandle } from 'react';

import Text from '../../material/Text';

import useParticleText, { EffectControl } from './useParticleText';

const SnowFlake = forwardRef<EffectControl>((_, ref) => {
  const [canvasRef, { start, stop }] = useParticleText({
    defaultText: 'so-so.dev 🎄🧦',
    effectDirection: 'top',
    colorSet: [
      `rgba(240,243,255, ${Math.random()})`,
      `rgba(227,230,255, ${Math.random()})`,
      `rgba(207,211,255, ${Math.random()})`,
      `rgba(190,193,246, ${Math.random()})`,
    ],
  });

  useImperativeHandle(
    ref,
    () => {
      return {
        start,
        stop,
      };
    },
    [start, stop]
  );

  return (
    <div className="relative [&_canvas]:w-full [&_canvas]:h-full [&_a]:absolute [&_a]:inset-0 [&_a]:w-full [&_a]:h-full">
      <canvas style={{ backgroundColor: 'black' }} ref={canvasRef} />
      <Text color="gray0" asChild>
        <a href="https://so-so.dev" target="_blank" rel="noreferrer" />
      </Text>
    </div>
  );
});

export default SnowFlake;
