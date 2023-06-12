import { AnimatePresence, motion } from 'framer-motion';
import { forwardRef, HTMLAttributes, useMemo } from 'react';

import { css, styled } from '../../../../../stitches.config';
import { PauseIcon } from '../../../material/icon/PauseIcon';
import { PlayIcon } from '../../../material/icon/Play';

interface PlayControlProps extends HTMLAttributes<HTMLButtonElement> {
  playing: boolean;
  onPlayingChange: (playing: boolean) => void;
  size?: number;
  reduceMotion?: boolean;
}

const ICON_COLOR = 'gray0';
const duration = {
  enter: 0.24,
  exit: 0.01,
};

export const PlayControl = forwardRef<HTMLButtonElement, PlayControlProps>(
  (
    { playing, onPlayingChange, size = 24, reduceMotion = false, ...restProps },
    ref
  ) => {
    const label = playing ? 'pause video' : 'play video';
    const handler = () => {
      onPlayingChange(!playing);
    };
    const Icon = useMemo(() => {
      return playing ? PauseIcon : PlayIcon;
    }, [playing]);

    return (
      <ResetButton
        aria-label={label}
        onClick={handler}
        ref={ref}
        reduceMotion={reduceMotion}
        {...restProps}
      >
        <span className={css({ size, position: 'relative' })()}>
          <AnimatePresence>
            <MotionSpan
              key={playing ? 'play' : 'pause'}
              initial={{
                scale: 0.6,
                opacity: 0.1,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.4,
                opacity: 0.1,
                transition: {
                  duration: reduceMotion ? 0 : duration.exit,
                },
              }}
              transition={{
                duration: reduceMotion ? 0 : duration.enter,
              }}
            >
              <Icon color={ICON_COLOR} size={size} />
            </MotionSpan>
          </AnimatePresence>
        </span>
      </ResetButton>
    );
  }
);

const ResetButton = styled('button', {
  resetButton: 'inline-flex',

  variants: {
    reduceMotion: {
      false: {
        '& svg': {
          transition: 'scale 0.24s ease',
        },

        '&:hover': {
          '& svg': {
            scale: 1.1,
          },
        },

        '&:active': {
          '& svg': {
            scale: 0.85,
          },
        },
      },
    },
  },
});

const MotionSpan = styled(motion.span, {
  position: 'absolute',
  inset: 0,
  lineHeight: 0,
});
