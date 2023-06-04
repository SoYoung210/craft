import { HTMLAttributes, useMemo } from 'react';

import { styled } from '../../../../stitches.config';
import { PauseIcon } from '../../material/icon/PauseIcon';
import { PlayIcon } from '../../material/icon/Play';

interface PlayControlProps extends HTMLAttributes<HTMLButtonElement> {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  size?: number;
}

const ICON_COLOR = 'gray0';
export function PlayControl({
  playing,
  onPlayingChange,
  size = 24,
  ...restProps
}: PlayControlProps) {
  const label = playing ? 'pause video' : 'play video';
  const handler = () => {
    onPlayingChange(!playing);
  };
  const Icon = useMemo(() => {
    return playing ? PauseIcon : PlayIcon;
  }, [playing]);

  return (
    <ResetButton aria-label={label} onClick={handler} {...restProps}>
      <Icon color={ICON_COLOR} size={size} />
    </ResetButton>
  );
}

const ResetButton = styled('button', {
  display: 'inline-flex',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)',
  overflow: 'hidden',

  margin: '0',
  padding: '0',

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
