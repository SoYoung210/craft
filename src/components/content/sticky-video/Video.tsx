import { useState, lazy, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';
import { useInView } from 'react-intersection-observer';

import { styled } from '../../../../stitches.config';
import { ArrowUpLeft } from '../../material/icon/ArrowUpLeft';

import { PlayControl as PlayControlRaw } from './Control';
import { Slider } from './Slider';

const VideoPlayer = lazy(() => import('react-player/lazy'));

const DEFAULT_WIDTH = 384;
const DEFAULT_HEIGHT = 216;
const ASPECT_RATIO = 632 / 355.5;

interface ProgressData {
  loaded: number;
  loadedSeconds: number;
  played: number;
  playedSeconds: number;
}
export function Video(props: ReactPlayerProps) {
  const { controls = false, ...restProps } = props;
  const { ref, inView: originVideoInView } = useInView({
    threshold: 0,
  });
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const floatingContainerRef = useRef<HTMLDivElement>(null);

  const [player, setPlayer] = useState<ReactPlayer | null>(null);
  const handleSeekChange = (value: number) => {
    setSeeking(true);
    setPlayed(value);
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    player?.seekTo(played);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  return (
    <>
      <Root ref={ref} data-todo-role="root">
        <VideoPlayer
          width="100%"
          height="auto"
          ref={player => setPlayer(player)}
          controls={controls}
          playing={playing}
          playsinline={true}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          style={{ aspectRatio: ASPECT_RATIO }}
          onProgress={(state: ProgressData) => {
            if (!seeking) {
              setPlayed(state.played);
            }
          }}
          {...restProps}
        />
        <PlayControl
          data-todo-role="control-button"
          playing={playing}
          onPlayingChange={setPlaying}
          size={200}
        />
        <ControlContainer>
          <Slider
            width="100%"
            value={played}
            onValueChange={handleSeekChange}
            max={0.999999}
            onPointerDown={handleSeekMouseDown}
            onPointerUp={handleSeekMouseUp}
          />
        </ControlContainer>
      </Root>
      {/** TODO: 나타날 때 약간 scale 효과주기 */}
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
            display: originVideoInView ? 'none' : 'block',
          }}
        >
          <ReactPlayer
            width="100%"
            height="100%"
            controls={controls}
            playing={playing}
            playsinline={true}
            {...restProps}
          />
          {/** FIXME: 항상 auto로 두고.. aspectRatio만 설정해두면 될수도.. */}
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
    </>
  );
}

const ControlContainer = styled('div', {
  position: 'absolute',
  bottom: 6,
  width: '95%',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
  opacity: 0,
  transition: 'opacity 0.24s cubic-bezier(0.33, 1, 0.68, 1)',
});

const PlayControl = styled(PlayControlRaw, {
  // opacity: 0,
  opacity: 1,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 2,
  scale: 1,
  transition: 'opacity 0.24s cubic-bezier(0.33, 1, 0.68, 1)',

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

const Root = styled('div', {
  position: 'relative',

  '&::after': {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  '&:hover': {
    '&::after': { content: '""' },
    [`& ${ControlContainer}, & ${PlayControl}`]: {
      opacity: 1,
    },
  },

  // reset video wrapper style
  '& > div': {
    lineHeight: 0,
  },
});

const FloatingContainer = styled('div', {
  width: DEFAULT_WIDTH,
  height: 'auto',
  aspectRatio: ASPECT_RATIO,
  willChange: 'transform',
  zIndex: 4,
  borderRadius: 16,
  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 24px',
  overflow: 'hidden',
});

const ResizeDiv = styled(motion.div, {
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: '$white024',
  cursor: 'ne-resize',
  position: 'absolute',
  top: 10,
  right: 10,

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
