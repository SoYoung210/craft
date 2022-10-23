import React, { useCallback, useMemo, useState } from 'react';

import { styled } from '../../stitches.config';
import PageLayout from '../components/layout/PageLayout';

export default function CardPage() {
  const [center, setCenter] = useState<{ x: number; y: number } | undefined>(
    undefined
  );
  const [cardElement, setCardElement] = useState<HTMLDivElement | null>(null);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = useCallback(
    e => {
      if (cardElement != null) {
        const bounds = cardElement.getBoundingClientRect();

        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const leftX = mouseX - bounds.x;
        const topY = mouseY - bounds.y;

        setCenter({ x: leftX - bounds.x / 2, y: topY - bounds.height / 2 });
      }
    },
    [cardElement]
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
    <PageLayout>
      <PageLayout.Title>3D Card</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          마우스 호버 위치에 따라 회전, 광원 효과 적용
        </PageLayout.Summary>
        <PageLayout.DetailsContent>
          회전 각: Math.log2(x, y 좌표 거리), 광원 gradient: #ffffff55,
          #0000000f
        </PageLayout.DetailsContent>
      </PageLayout.Details>
      <CardRoot
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setCenter(undefined)}
      >
        <Card ref={setCardElement} css={{ transform: cardTransform }}>
          <Glow css={{ backgroundImage: glowBackgroundImage }} />
        </Card>
      </CardRoot>

      <Caption>hover and move mouse</Caption>
    </PageLayout>
  );
}

const CardRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  perspective: 800,
});

const Caption = styled('caption', {
  fontFamily: 'monospace',
  color: '$gray8',
});

const Card = styled('div', {
  height: '60vh',
  aspectRatio: '3 / 4',
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
