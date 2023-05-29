import { styled } from '../../../../stitches.config';
import { PauseIcon } from '../../material/icon/PauseIcon';
import { PlayIcon } from '../../material/icon/Play';

interface PlayControlProps {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
}

// const ICON_COLOR = 'white';
const ICON_COLOR = 'gray0';
export function PlayControl({ playing, onPlayingChange }: PlayControlProps) {
  const label = playing ? 'pause video' : 'play video';
  const handler = () => {
    onPlayingChange(!playing);
  };
  const Icon = playing ? PauseIcon : PlayIcon;

  return (
    <ResetButton aria-label={label} onClick={handler}>
      <Icon color={ICON_COLOR} />
    </ResetButton>
  );
}

export function SeekControl() {}

const ResetButton = styled('button', {
  display: 'inline-flex',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
  overflow: 'hidden',

  margin: '0',
  padding: '0',

  color: 'red',

  outline: '0',
  border: '0 solid transparent',
  background: 'transparent',
  cursor: 'pointer',

  fontFamily: 'inherit',
  fontWeight: '600',
  '-webkit-font-smoothing': 'antialiased',

  '&:hover,&:focus': {
    textDecoration: 'none',
  },

  '&:focus': {
    outline: 'none',
  },
});
