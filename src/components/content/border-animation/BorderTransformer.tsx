import { ReactNode, useMemo } from 'react';

import { useBorderAnimationContext } from './context';

interface Props {
  duration: number;
  children: ReactNode;
}

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
      <div
        className="w-full h-[400%] [animation-name:border-spin] [animation-timing-function:linear] [animation-iteration-count:infinite]"
        style={{
          animationDuration: `${duration}ms`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
