import React, { useCallback, useMemo, useState } from 'react';

import { styled } from '../../stitches.config';

export default function CardPage() {
  const [center, setCenter] = useState<{ x: number; y: number } | undefined>(
    undefined
  );
  const [cardElement, setCardElement] = useState<HTMLDivElement | null>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      const bounds = e.currentTarget.getBoundingClientRect();

      const mouseX = e.clientX;
      const mouseY = e.clientY;
      const leftX = mouseX - bounds.x;
      const topY = mouseY - bounds.y;

      setCenter({ x: leftX - bounds.x / 2, y: topY - bounds.height / 2 });
    },
    []
  );
  const cardTransform = useMemo(() => {
    if (center == null || cardElement == null) {
      return;
    }

    const distance = Math.sqrt(center.x ** 2 + center.y ** 2);
    const scale = `scale3d(1.07, 1.07, 1.07)`;
    const rotate = `rotate3d(${center.y / 10}, ${-center.x / 10}, 0, ${
      Math.log2(distance) * 2
    }deg)`;
    return `${scale} ${rotate}`;
  }, [cardElement, center]);

  const glowBackgroundImage = useMemo(() => {
    if (center == null || cardElement == null) {
      return;
    }
    const bounds = cardElement.getBoundingClientRect();

    return `radial-gradient(circle at ${center.x * 2 + bounds.width / 2}px ${
      center.y * 2 + bounds.height / 2
    }px, #ffffff55, #0000000f)`;
  }, [cardElement, center]);

  return (
    <Root>
      <Card
        ref={setCardElement}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCenter(undefined)}
        css={{ transform: cardTransform }}
      >
        <Glow css={{ backgroundImage: glowBackgroundImage }} />
      </Card>
    </Root>
  );
}
/**
 *
 */
const Root = styled('div', {
  perspective: 800,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  height: '100vh',
});

const Card = styled('div', {
  width: 300,
  height: 400,
  boxShadow: '0 1px 5px #00000099',
  borderRadius: 10,

  backgroundImage:
    'url(https://images.unsplash.com/photo-1446038236174-69712e24d137?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80)',
  backgroundSize: 'cover',

  // glow relative
  position: 'relative',

  transitionDuration: '0.3s',
  transitionProperty: 'transform, box-shadow',
  transitionTimingFunction: 'ease-out',
  transform: 'rotate3d(0)',
});

const Glow = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  left: 0,
  top: 0,

  backgroundImage: 'radial-gradient(circle at 50% -20%, #ffffff22, #0000000f)',
});
