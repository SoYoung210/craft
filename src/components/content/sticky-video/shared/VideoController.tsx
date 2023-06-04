import { Primitive } from '@radix-ui/react-primitive';
import { ComponentPropsWithoutRef, forwardRef, ReactNode } from 'react';

import { ease, styled } from '../../../../../stitches.config';

import { PlayControl as PlayControlRaw } from './PlayControl';

interface VideoControllerProps extends ComponentPropsWithoutRef<typeof Root> {
  children: ReactNode;
}
const VideoControllerImpl = forwardRef<HTMLDivElement, VideoControllerProps>(
  (props, ref) => {
    const { children, ...restProps } = props;

    return (
      <Root ref={ref} {...restProps}>
        {children}
      </Root>
    );
  }
);

const BottomControlContainer = styled('div', {
  position: 'absolute',
  bottom: 6,
  width: '95%',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
  opacity: 0,
  transition: `opacity 0.24s ${ease.easeOutCubic}`,
});

const PlayControl = styled(PlayControlRaw, {
  opacity: 0,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 2,
  scale: 1,
  transition: `opacity 0.24s ${ease.easeOutCubic}`,

  // FIXME: svg 사이즈좀 줄여야겠다..
  '& > svg': {
    transition: 'scale 0.24s ease',
  },

  '&:hover': {
    '& > svg': {
      scale: 1.1,
    },
  },
});

const Root = styled(Primitive.div, {
  position: 'relative',

  '&::after': {
    content: '""',
    opacity: 0,
    transition: `opacity 0.24s ${ease.easeOutCubic}`,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },

  '&:hover': {
    '&::after': { opacity: 1 },
    [`& ${BottomControlContainer}, & ${PlayControl}`]: {
      opacity: 1,
    },
  },

  // reset video wrapper style
  '& > div': {
    lineHeight: 0,
  },
});

export const VideoController = Object.assign({}, VideoControllerImpl, {
  PlayControl,
  BottomControlContainer,
});
