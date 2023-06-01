import { useState, lazy, useRef } from 'react';
import { motion } from 'framer-motion';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';
import { useInView } from 'react-intersection-observer';

import { styled } from '../../../../stitches.config';
import { HStack } from '../../material/Stack';
import { ArrowUpLeft } from '../../material/icon/ArrowUpLeft';

import { PlayControl } from './Control';
import { Slider } from './Slider';

const VideoPlayer = lazy(() => import('react-player/lazy'));

const DEFAULT_WIDTH = 384;
const DEFAULT_HEIGHT = 216;

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
  const [duration, setDuration] = useState(0);
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
    <Root ref={ref} data-todo-role="root">
      <VideoPlayer
        width="100%"
        ref={player => setPlayer(player)}
        controls={controls}
        playing={playing}
        onDuration={setDuration}
        playsinline={true}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onProgress={(state: ProgressData) => {
          // TODO: seeking 처리하기
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
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
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
            width: DEFAULT_WIDTH,
            height: DEFAULT_HEIGHT,
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
                const { width, height } = getNextSize(
                  { width: originWidth, height: originHeight },
                  offset,
                  direction
                );

                floatingContainerRef.current?.setAttribute(
                  'style',
                  `width: ${width}px; height: ${height}px;`
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
    </Root>
  );
}

const Root = styled('div', {
  position: 'relative',
});
const ControlContainer = styled('div', {
  position: 'absolute',
  bottom: 0,
  width: '100%',
});

const FloatingContainer = styled('div', {
  background: '#A5A7A7',
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  willChange: 'transform',
  zIndex: 4,
  borderRadius: 16,
  border: '1px solid #A5A7A7',
  boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 24px',
  overflow: 'hidden',
});

const ResizeDiv = styled(motion.div, {
  width: 100,
  height: 30,
  backgroundColor: 'steelblue',
  cursor: 'ne-resize',
  position: 'absolute',
  top: 0,
  right: 0,

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
