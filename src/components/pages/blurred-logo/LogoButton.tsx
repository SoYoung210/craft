import React, { ReactElement } from 'react';

import { styled } from '../../../../stitches.config';
// layer쌓기
interface Props {
  logo: ReactElement;
}
export default function LogoButton({ logo }: Props) {
  return (
    <Button>
      <BottomLayer1>{logo}</BottomLayer1>
      <Content>
        <HighlightBar side="left" />
        <HighlightBar side="right" />
        <BottomLayer2>{logo}</BottomLayer2>
        <BgLayer1>{logo}</BgLayer1>
        <BgLayer2>{logo}</BgLayer2>
        <ContentLayer>{logo}</ContentLayer>
      </Content>
    </Button>
  );
}

const Button = styled('button', {
  background: 'transparent',
  border: 0,

  position: 'relative',

  width: 200,
  height: 200,
  borderRadius: 48,
  willChange: 'transform',
  transition: 'filter 0.15s ease',

  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const Content = styled('div', {
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  position: 'relative',
  borderRadius: 'inherit',
});

const Layer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'absolute',
  // image drag prevent
  pointerEvents: 'none',
  userSelect: 'none',
  width: '100%',
  height: '100%',

  '& svg': {
    width: '54%',
    height: '54%',
    zIndex: 2,
  },
});

const BottomLayer1 = styled(Layer, {
  zIndex: -1,
  bottom: -48,
  left: 0,

  filter: 'blur(45px) opacity(0.7)',
});

const BottomLayer2 = styled(Layer, {
  zIndex: -1,
  bottom: -12,
  left: 0,
  width: '100%',
  height: '100%',

  transform: 'scale(0.5)',
  filter: 'blur(20px) opacity(0.7)',
});

// primary bg layer
const BgLayer1 = styled(Layer, {
  top: 0,
  left: 0,

  // center origin scale
  transform: 'scale(2)',
  filter: 'blur(20px) opacity(0.3) saturate(250%)',

  '& svg': {
    width: '100%',
    height: '100%',
  },
});

const BgLayer2 = styled(Layer, {
  bottom: 0,
  left: 0,
  '&&': {
    height: '50%',
  },

  // center origin scale
  transform: 'scale(2.4)',
  filter: 'blur(15px) opacity(0.1) brightness(20%)',
});

const ContentLayer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',

  '& svg': {
    width: '50%',
    height: '50%',
    zIndex: 2,
  },
});

const HighlightBar = styled('div', {
  position: 'absolute',
  height: '70%',
  zIndex: 2,
  background: '$white',
  filter: 'blur(5px)',
  opacity: 0.3,
  top: 32,
  width: 10,

  variants: {
    side: {
      left: {
        left: 16,
      },
      right: {
        right: 16,
      },
    },
  },
});
