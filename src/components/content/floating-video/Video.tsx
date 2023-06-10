import { lazy } from 'react';
import { ReactPlayerProps } from 'react-player/lazy';
import { useInView } from 'react-intersection-observer';

import { Slider } from './Slider';
import { FloatingVideo } from './FloatingVideo';
import { VideoController } from './shared/VideoController';
import { useMultiVideoControl } from './useVideoControl';

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
  const [
    { addPlayer },
    {
      playing,
      onPlayingChange,
      played,
      onPlayedChange,
      seeking,
      onSeekingChange,
      onSeekMouseDown,
      onSeekMouseUp,
    },
  ] = useMultiVideoControl();

  return (
    <>
      <VideoController ref={ref}>
        <VideoPlayer
          width="100%"
          height="auto"
          ref={addPlayer}
          controls={controls}
          playing={playing}
          playsinline={true}
          onPlay={() => onPlayingChange(true)}
          onPause={() => onPlayingChange(false)}
          style={{ aspectRatio: ASPECT_RATIO }}
          onProgress={(state: ProgressData) => {
            if (!seeking) {
              onPlayedChange(state.played);
            }
          }}
          {...restProps}
        />
        <VideoController.PlayControl
          playing={playing}
          onPlayingChange={onPlayingChange}
          size={100}
        />
        <VideoController.BottomControlContainer>
          <Slider
            width="100%"
            value={played}
            onValueChange={onSeekingChange}
            max={0.999999}
            onPointerDown={onSeekMouseDown}
            onPointerUp={onSeekMouseUp}
          />
        </VideoController.BottomControlContainer>
      </VideoController>
      {!originVideoInView && (
        <FloatingVideo
          controls={controls}
          onPlayingChange={onPlayingChange}
          playing={playing}
          addPlayer={addPlayer}
          onSeekingChange={onSeekingChange}
          onSeekMouseDown={onSeekMouseDown}
          onSeekMouseUp={onSeekMouseUp}
          played={played}
          {...restProps}
        />
      )}
    </>
  );
}
