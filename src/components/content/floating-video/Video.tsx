import VideoPlayer, { ReactPlayerProps } from 'react-player/lazy';
import { useInView } from 'react-intersection-observer';
import { GatsbyImage } from 'gatsby-plugin-image';
import { useState } from 'react';

import { Slider } from './Slider';
import { FloatingVideo } from './FloatingVideo';
import { VideoController } from './shared/VideoController';
import { useMultiVideoControl } from './hooks/useVideoControl';

interface ProgressData {
  loaded: number;
  loadedSeconds: number;
  played: number;
  playedSeconds: number;
}

interface VideoProps extends ReactPlayerProps {
  aspectRatio: string;
}
export function Video(props: VideoProps) {
  const { controls = false, aspectRatio, poster, ...restProps } = props;
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

  const [ready, setReady] = useState(false);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
      <GatsbyImage
        alt=""
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: 'auto',
          aspectRatio,
          width: '100%',
          filter: 'blur(32px)',
          transform: 'translateZ(0px)',
        }}
        image={poster}
      />
      <VideoController
        ref={ref}
        style={{ pointerEvents: ready ? 'auto' : 'none' }}
      >
        <VideoPlayer
          width="100%"
          height="auto"
          ref={addPlayer}
          controls={controls}
          playing={playing}
          playsinline={true}
          onPlay={() => onPlayingChange(true)}
          onPause={() => onPlayingChange(false)}
          style={{ aspectRatio }}
          onReady={player => {
            setReady(true);
          }}
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
          aspectRatio={aspectRatio}
          {...restProps}
        />
      )}
    </div>
  );
}
