import { HTMLAttributes, useMemo } from 'react';

import { styled } from '../../../../../stitches.config';
import { PauseIcon } from '../../../material/icon/PauseIcon';
import { PlayIcon } from '../../../material/icon/Play';

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
  resetButton: 'inline-flex',
});
