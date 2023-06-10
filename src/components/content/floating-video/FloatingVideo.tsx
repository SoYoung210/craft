import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';

import { css, styled } from '../../../../stitches.config';
import { ArrowUpLeft } from '../../material/icon/ArrowUpLeft';
import { Underline } from '../../material/icon/Underline';
import { HStack } from '../../material/Stack';
import { RequiredKeys } from '../../../utils/type';
import { useBooleanState } from '../../../hooks/useBooleanState';

import { VideoController } from './shared/VideoController';
import { Slider } from './Slider';
import { MinimalVideo } from './MinimalVideo';
import { FloatingIconRoot } from './shared/FloatingIcon';

// TODO: prop으로 받으면 좋음..
const DEFAULT_WIDTH = 384;
const MIN_SIZE = 342;
const ASPECT_RATIO = (632 / 355.5).toString();

interface FloatingVideoProps extends RequiredKeys<ReactPlayerProps, 'playing'> {
  onPlayingChange: (playing: boolean) => void;
  addPlayer: (player: ReactPlayer) => void;
  played: number;
  onSeekingChange: (v: number) => void;
  onSeekMouseDown: () => void;
  onSeekMouseUp: () => void;
}

/**
 * TODO: 0605주에 할일
 * - minimize되었을 때의 control추가하기
 * - 코드 인터페이스 정리하기
 * - minimize 에서 expand누를 때 화살표 살짝 증가하게
 * - minimize추가기능 (like arc)
 */

export function FloatingVideo(props: FloatingVideoProps) {
  const {
    controls = false,
    playing = false,
    onPlayingChange,
    addPlayer,
    played,
    onSeekingChange,
    onSeekMouseDown,
    onSeekMouseUp,
    ...restProps
  } = props;
  const [canDrag, setCanDrag] = useState(true);
  const floatingContainerRef = useRef<HTMLDivElement>(null);

  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [minimize, setMinimize, setExpand] = useBooleanState(false);
  // const floatingVideoHeight = minimize ? 'unset' : '100%';
  const floatingVideoHeight = 'unset';
  const floatingVideoRootHeight = minimize ? 40 : 'auto';

  const player = useMemo(() => {
    return (
      <ReactPlayer
        width="100%"
        ref={addPlayer}
        height={floatingVideoHeight}
        controls={controls}
        playing={playing}
        onPlay={() => onPlayingChange(true)}
        onPause={() => onPlayingChange(false)}
        playsinline={true}
        {...restProps}
      />
    );
  }, [
    addPlayer,
    controls,
    floatingVideoHeight,
    onPlayingChange,
    playing,
    restProps,
  ]);

  return (
    <AnimatePresence>
      {minimize ? (
        <MinimalVideo
          key="minimal"
          playing={playing}
          onPlayingChange={onPlayingChange}
          onExpand={setExpand}
        >
          {player}
        </MinimalVideo>
      ) : (
        <VideoController
          key="floating01"
          asChild
          data-todo-role="floating-video-root"
          className={css({
            position: 'fixed',
            bottom: 0,
            left: 0,
            height: floatingVideoRootHeight,
            width: `min(${width}px, 80vw)`,
            aspectRatio: ASPECT_RATIO,
            willChange: 'transform',
            borderRadius: 12,
            boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 24px',
            overflow: 'hidden',
          })()}
          style={{ width: `min(${width}px, 80vw)` }}
        >
          <motion.div
            key="floating"
            style={{
              originX: 0.5,
              originY: 1,
            }}
            ref={floatingContainerRef}
            drag={canDrag}
            dragMomentum={false}
            // FIXME: 오른쪽도 window size맞춰서 잡아주기
            dragConstraints={{ left: 0, bottom: 0 }}
            initial={{
              filter: 'blur(6px)',
              scale: 0.4,
            }}
            animate={{
              filter: 'blur(0px)',
              scale: 1,
            }}
            exit={{
              filter: 'blur(6px)',
              scale: 0.4,
              opacity: 0,
              y: 60,
            }}
            transition={{
              duration: 0.3,
            }}
            onDragEnd={() => {
              setCanDrag(true);
            }}
          >
            {player}
            <VideoController.PlayControl
              playing={playing}
              onPlayingChange={onPlayingChange}
              size={80}
            />
            <VideoController.BottomControlContainer>
              <Slider
                data-todo-role="floating-video-slider"
                width="100%"
                value={played}
                onValueChange={onSeekingChange}
                max={0.999999}
                draggable={false}
                onPointerDown={() => {
                  setCanDrag(false);
                  onSeekMouseDown();
                }}
                onPointerUp={() => {
                  setCanDrag(true);
                  onSeekMouseUp();
                }}
              />
            </VideoController.BottomControlContainer>
            <FloatingIconContainer gap={8}>
              <FloatingIconRoot asChild>
                <MinimizeButton>
                  <Underline onClick={setMinimize} color="white" />
                </MinimizeButton>
              </FloatingIconRoot>
              <FloatingIconRoot asChild>
                <ResizeButton
                  drag={true}
                  onDrag={(event, info) => {
                    const offset = getBiggerOffset(info.delta.x, info.delta.y);

                    const originWidth =
                      floatingContainerRef.current?.offsetWidth;

                    if (originWidth != null) {
                      setWidth(Math.max(offset + originWidth, MIN_SIZE));
                    }
                  }}
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  dragElastic={0}
                  dragMomentum={false}
                >
                  <ArrowUpLeft color="white" />
                </ResizeButton>
              </FloatingIconRoot>
            </FloatingIconContainer>
          </motion.div>
        </VideoController>
      )}
    </AnimatePresence>
  );
}

// TODO: size를 별도로 관리해야..
// 아이콘 래퍼같은게..
const FloatingIconContainer = styled(HStack, {
  position: 'absolute',
  top: 10,
  right: 10,
  zIndex: 1,
});

const MinimizeButton = styled(motion.button, {
  resetButton: 'flex',

  'svg path': {
    transition: 'transform 0.2s ease-in-out',
  },

  '&:active': {
    'svg path': {
      transform: 'translateY(4px)',
    },
  },
});

const ResizeButton = styled(motion.button, {
  resetButton: 'flex',
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

  '&:active': {
    'svg path:first-of-type': {
      transform: 'translateY(-4px)',
    },
    'svg path:last-of-type': {
      transform: 'scaleY(1.3) translateY(-2px)',
    },
  },
});

/**
 *
 * @param x 양수: 우측으로 움직임 / 음수: 왼쪽으로 움직임
 * @param y 양수: 아래로 / 음수: 위로
 * @returns
 */
function getBiggerOffset(x: number, y: number) {
  const toIncrease = x > 0 || y < 0;
  const offset = Math.abs(x) > Math.abs(y) ? x : y;

  return toIncrease ? toPositive(offset) : toNegative(offset);
}

function toPositive(num: number) {
  return num > 0 ? num : -num;
}

function toNegative(num: number) {
  return num < 0 ? num : -num;
}
