import { useState, lazy } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player/lazy';
import { useInView } from 'react-intersection-observer';

import { styled } from '../../../../stitches.config';
import { HStack } from '../../material/Stack';

import { PlayControl } from './Control';
import { Slider } from './Slider';

const VideoPlayer = lazy(() => import('react-player/lazy'));

const DEFAULT_WIDTH = 288;
const DEFAULT_HEIGHT = 190;
export function Video(props: ReactPlayerProps) {
  const { controls = false, ...restProps } = props;
  const { ref, inView: originVideoInView } = useInView({
    threshold: 0,
  });
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);

  console.log('duration', duration);

  return (
    <Root ref={ref}>
      <VideoPlayer
        width="100%"
        controls={controls}
        playing={playing}
        onDuration={setDuration}
        {...restProps}
      />
      <ControlContainer>
        <HStack gap={4}>
          <PlayControl playing={playing} onPlayingChange={setPlaying} />
          <Slider width={440} max={duration} />
        </HStack>
      </ControlContainer>
      <FloatingContainer
        style={{
          display: originVideoInView ? 'none' : 'block',
        }}
      >
        <ReactPlayer
          width="100%"
          height={DEFAULT_HEIGHT}
          controls={controls}
          playing={playing}
          {...restProps}
        />
      </FloatingContainer>
    </Root>
  );
}

const Root = styled('div', {
  position: 'relative',
});
const ControlContainer = styled('div', {
  position: 'absolute',
  bottom: 0,
  display: 'flex',
});

const FloatingContainer = styled('div', {
  position: 'fixed',
  bottom: 0,
  left: 0,
  background: '#202020',
  width: DEFAULT_WIDTH,
  height: DEFAULT_HEIGHT,
  willChange: 'transform',
  zIndex: 4,
  borderRadius: 8,
});
