import { Primitive } from '@radix-ui/react-primitive';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';

import { css, styled } from '../../../../stitches.config';
import { ArrowUpLeft } from '../../material/icon/ArrowUpLeft';
import { Underline } from '../../material/icon/Underline';
import { HStack } from '../../material/Stack';

// TODO: prop으로 받으면 좋음..
const DEFAULT_WIDTH = 384;
const ASPECT_RATIO = 632 / 355.5;

interface FloatingVideoProps extends ReactPlayerProps {
  visible: boolean;
}

export function FloatingVideo(props: FloatingVideoProps) {
  const { controls = false, visible, ...restProps } = props;
  const floatingContainerRef = useRef<HTMLDivElement>(null);

  const [minimize, setMinimize] = useState(false);
  const floatingVideoHeight = minimize ? 'unset' : '100%';
  const floatingVideoRootHeight = minimize ? 40 : 'auto';

  return (
    <motion.div
      style={{ position: 'fixed', bottom: 0, left: 0 }}
      drag={true}
      dragMomentum={false}
      // FIXME: 오른쪽도 window size맞춰서 잡아주기
      dragConstraints={{ left: 0, bottom: 0 }}
    >
      <FloatingContainer
        ref={floatingContainerRef}
        style={{
          display: visible ? 'block' : 'none',
          height: floatingVideoRootHeight,
        }}
      >
        <ReactPlayer
          width="100%"
          height={floatingVideoHeight}
          controls={controls}
          playsinline={true}
          {...restProps}
        />
        <FloatingIconContainer gap={8}>
          <FloatingIconRoot asChild>
            <button className={css({ resetButton: 'inline-flex' })()}>
              <Underline onClick={() => setMinimize(true)} color="white" />
            </button>
          </FloatingIconRoot>
          <FloatingIconRoot asChild>
            <ResizeDiv
              drag={true}
              onDrag={(event, info) => {
                const { offset, direction } = getBiggerOffset(
                  info.delta.x,
                  info.delta.y
                );
                const originWidth = floatingContainerRef.current?.offsetWidth;
                const originHeight = floatingContainerRef.current?.offsetHeight;

                if (originWidth != null && originHeight != null) {
                  const { width } = getNextSize(
                    { width: originWidth, height: originHeight },
                    offset,
                    direction
                  );

                  floatingContainerRef.current?.setAttribute(
                    'style',
                    `width: ${width}px`
                  );
                }
              }}
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0}
              dragMomentum={false}
            >
              <ArrowUpLeft color="white" />
            </ResizeDiv>
          </FloatingIconRoot>
        </FloatingIconContainer>
        <ResizeDiv
          drag={true}
          onDrag={(event, info) => {
            const { offset, direction } = getBiggerOffset(
              info.delta.x,
              info.delta.y
            );
            const originWidth = floatingContainerRef.current?.offsetWidth;
            const originHeight = floatingContainerRef.current?.offsetHeight;

            if (originWidth != null && originHeight != null) {
              const { width } = getNextSize(
                { width: originWidth, height: originHeight },
                offset,
                direction
              );

              floatingContainerRef.current?.setAttribute(
                'style',
                `width: ${width}px`
              );
            }
          }}
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
          dragElastic={0}
          dragMomentum={false}
        >
          <ArrowUpLeft color="white" />
        </ResizeDiv>
      </FloatingContainer>
    </motion.div>
  );
}

const FloatingContainer = styled('div', {
  width: DEFAULT_WIDTH,
  height: 'auto',
  aspectRatio: ASPECT_RATIO,
  willChange: 'transform',
  borderRadius: 16,
  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 24px',
  overflow: 'hidden',
});

// TODO: size를 별도로 관리해야..
// 아이콘 래퍼같은게..
const FloatingIconContainer = styled(HStack, {
  position: 'absolute',
  top: 10,
  right: 10,
});
const FloatingIconRoot = styled(Primitive.div, {
  width: 40,
  height: 40,
  borderRadius: 8,
  // backgroundColor: '$white024',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&:hover': {
    backgroundColor: '$white024',
  },
});

const ResizeDiv = styled(motion.div, {
  cursor: 'ne-resize',

  svg: {
    transform: 'rotate(45deg)',
  },

  'svg path': {
    transition: 'transform 0.2s ease-in-out',
  },

  'svg path:last-of-type': {
    transformOrigin: 'center',
  },

  '&:hover': {
    'svg path:first-of-type': {
      transform: 'translateY(-4px)',
    },
    'svg path:last-of-type': {
      transform: 'scaleY(1.3) translateY(-2px)',
    },
  },
});

function getBiggerOffset(
  x: number,
  y: number
): { offset: number; direction: 'x' | 'y' } {
  if (Math.abs(x) > Math.abs(y)) {
    return { offset: x, direction: 'x' };
  } else {
    return { offset: y, direction: 'y' };
  }
}

function getNextSize(
  originSize: {
    width: number;
    height: number;
  },
  offset: number,
  direction: 'x' | 'y'
) {
  const aspectRatio = originSize.height / originSize.width;

  if (direction === 'x') {
    const offsetHeight = aspectRatio * offset;
    return {
      width: originSize.width + offset,
      height: originSize.height + offsetHeight,
    };
  } else {
    const offsetWidth = offset / aspectRatio;
    return {
      width: originSize.width + offsetWidth,
      height: originSize.height + offset,
    };
  }
}
