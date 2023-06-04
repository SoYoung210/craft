import { useState, lazy } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';
import { useInView } from 'react-intersection-observer';

import { ease, styled } from '../../../../stitches.config';

import { PlayControl as PlayControlRaw } from './Control';
import { Slider } from './Slider';
import { FloatingVideo } from './FloatingVideo';

const VideoPlayer = lazy(() => import('react-player/lazy'));

// TODO: prop으로 받으면 좋음..
const DEFAULT_WIDTH = 384;
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
      <FloatingVideo
        visible={!originVideoInView}
        controls={controls}
        {...restProps}
      />
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
  transition: `opacity 0.24s ${ease.easeOutCubic}`,
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

const Root = styled('div', {
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
    [`& ${ControlContainer}, & ${PlayControl}`]: {
      opacity: 1,
    },
  },

  // reset video wrapper style
  '& > div': {
    lineHeight: 0,
  },
});
