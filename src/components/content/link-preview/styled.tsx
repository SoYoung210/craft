import * as RadixTooltip from '@radix-ui/react-tooltip';

import { keyframes, styled } from '../../../../stitches.config';

const slideUp = keyframes({
  from: {
    opacity: 0,
    transform: 'translateY(20px)',
  },
  to: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
});

const slidedown = keyframes({
  from: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
  to: {
    opacity: 0,
    transform: 'translateY(20px)',
  },
});

// TODO: research
const shiny = keyframes({
  from: {
    maskPosition: '100%',
    '-webkit-mask-position': '100%',
  },
  to: {
    maskPosition: 0,
    '-webkit-mask-position': 0,
  },
});

const Content = styled(RadixTooltip.Content, {
  backgroundColor: '$white',
  borderRadius: 12,
  padding: 8,
  boxShadow: '0px 9px 15px 3px rgba(0,0,0,0.09)',
  animationDuration: 0.2,
  animationTimingFunction: 'linear',

  '&[data-state="delayed-open"]': {
    animationName: slideUp,
  },
  '&[data-state="closed"]': {
    animationName: slidedown,
  },
});

const Image = styled('img', {
  borderRadius: 12,
  width: 200,
  height: 120,
  objectFit: 'cover',
  objectPosition: 'top',
  maskImage: `linear-gradient(
    60deg,
    black 25%,
    rgba(0, 0, 0, 0.5) 50%,
    black 75%
  )`,
  maskSize: '400%',
  maskPosition: '100%',
  animationName: `${shiny}`,
  animationDuration: '1s',
  animationTimingFunction: 'ease',
});

const loadingSkeletonAnimation = keyframes({
  from: {
    backgroundPosition: '-468px 0',
  },
  to: {
    backgroundPosition: '468px 0',
  },
});

// TODO: 공통컴포넌트로 분리? 혹은 만들었던 스켈레톤 컴포넌트 사용하기
export const LoadingSkeleton = styled('div', {
  position: 'relative',
  width: 200,
  height: 120,
  borderRadius: 12,
  animation: `${loadingSkeletonAnimation} 1.25s infinite linear forwards`,
  background:
    'linear-gradient(to right, #eeeeee 10%, #dddddd 18%, #eeeeee 33%)',
  backgroundSize: '800px 100%',
});

export const Tooltip = {
  ...RadixTooltip,
  Content,
  Image,
};
