// like radix-ui Tab.Content

import { AnimatePresence, motion, Variants } from 'framer-motion';
import { forwardRef, ReactElement } from 'react';

import { styled } from '../../../../stitches.config';
import { NOISE } from '../switch-tab/constants';

import { useMenuDockContext } from './context';

// index -> value is better
export interface DockContentProps {
  children: React.ReactNode;
  index: number;
  bottomAddon?: ReactElement;
}
const xAmount = 290;
const yAmount = 40;
const yRotate = 18;
const x = {
  left: -1 * xAmount,
  right: xAmount,
};

const rotateY = {
  right: yRotate,
  left: -1 * yRotate,
};
interface AnimateParams {
  direction: number;
}

const variants: Variants = {
  enter: ({ direction }: AnimateParams) => {
    return {
      x: direction > 0 ? x.left : x.right,
      rotateY: direction > 0 ? rotateY.left : rotateY.right,
      y: yAmount,
      opacity: 0,
      scale: 0.85,
      transformPerspective: 400,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    y: 0,
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transformPerspective: 400,
  },
  exit: ({ direction }: AnimateParams) => {
    return {
      zIndex: 0,
      x: direction > 0 ? x.right : x.left,
      y: yAmount,
      rotateY: direction < 0 ? rotateY.left : rotateY.right,
      opacity: 0,
      scale: 0.85,
      transformPerspective: 400,
    };
  },
};
export const DockContentImpl = forwardRef<HTMLDivElement, DockContentProps>(
  (props, ref) => {
    const { children, index, bottomAddon, ...restProps } = props;
    const { activeIndex, direction } = useMenuDockContext('DockContent');
    const visible = activeIndex === index;
    const animationDirection = direction === 'clockwise' ? 1 : -1;

    return (
      <AnimatePresence
        initial={false}
        custom={{ direction: animationDirection }}
      >
        {visible ? (
          <MotionRoot
            ref={ref}
            key={index}
            custom={{ direction: animationDirection }}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              ease: [0.45, 0, 0.55, 1],
              duration: 0.5,
              opacity: { duration: 0.3 },
            }}
            {...restProps}
          >
            {children}
            <Fog>{bottomAddon}</Fog>
          </MotionRoot>
        ) : null}
      </AnimatePresence>
    );
  }
);

const BottomAddonRoot = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: '100%',
  padding: '0 0 26px 26px',
  color: 'rgb(29,29,31)',
  fontSize: '14px',
});

const Title = styled('div', {
  fontWeight: 600,
});

const Caption = styled('div', {
  marginTop: 4,
});

const Fog = styled('div', {
  width: '100%',
  height: '46%',
  zIndex: 1,

  position: 'absolute',
  bottom: 0,
  left: 0,
  borderRadius: '0px 0px 32px 32px',

  background:
    'linear-gradient(transparent, rgba(255, 255, 255, 0.416) 58%, rgb(255, 255, 255, 0.52) 100%)',
  // backdropFilter: 'blur(16px)',
});

/*
TODO:
- [] 그라디언트 이미지 초기로딩 느림으로 인해 흰색 뜨는것 고쳐보기 (webp convert?)
- [x] 처음에 반대로 움직이는 것 고치기
- [] 움직이는 애니메이션 튜닝하기(사라지는게 좀 느린듯)
- [] 이미지 노이즈 텍스쳐 고민좀 해봐야함. 옮기던지 빼던지 (이미지 채도가 좀 높긴해서..)
- [] 이미지 영역에 inset box-shadow들어가게 해야함 (구분감이 너무 약함) (:after써야 할듯?)
- [] 배경 bg 그라디언트가 좀 약한것 같기도 하다..
*/
const MotionRoot = styled(motion.div, {
  height: 240,
  width: 240,
  position: 'absolute',
  borderRadius: 32,
  display: 'flex',
  alignItems: 'center',
  // FIXME: 이미지 노이즈 텍스쳐 고민좀 해봐야함;
  backgroundImage: NOISE,
  backgroundColor: 'rgba(253, 253, 253, 0.75)',
  // backdropFilter: 'blur(35px)',
});

export const DockContent = Object.assign(DockContentImpl, {
  BottomAddonRoot,
  Title,
  Caption,
});
