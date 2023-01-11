import { ReactNode, useMemo } from 'react';

import { keyframes, styled } from '../../../../stitches.config';

import { useBorderAnimationContext } from './context';

interface Props {
  duration: number;
  children: ReactNode;
}

const spin = keyframes({
  from: {
    transform: 'translateY(-50%) rotate(0)',
  },
  to: {
    transform: 'translateY(-50%) rotate(360deg)',
  },
});
export default function BorderTransformer(props: Props) {
  const { duration, children } = props;
  const { maskElement } = useBorderAnimationContext(
    'BorderAnimation/Transformer'
  );

  const maskElementAspectRatio = useMemo(() => {
    if (maskElement == null) {
      return 1;
    }

    return maskElement.clientWidth / maskElement.clientHeight;
  }, [maskElement]);

  return (
    <div
      style={{
        transform: `scaleX(${maskElementAspectRatio})`,
        position: 'absolute',
        top: '50%',
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <AnimationDiv
        style={{
          animationDuration: `${duration}ms`,
        }}
      >
        {children}
      </AnimationDiv>
    </div>
  );
}

const AnimationDiv = styled('div', {
  width: '100%',
  height: '400%',
  animationName: spin.toString(),
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
});
