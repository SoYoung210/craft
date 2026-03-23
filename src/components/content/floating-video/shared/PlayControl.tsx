import { AnimatePresence, motion } from 'motion/react';
import { forwardRef, HTMLAttributes, useMemo } from 'react';

import { cn } from '../../../../utils/cn';
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
    { playing, onPlayingChange, size = 24, reduceMotion = false, className, ...restProps },
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
      <button
        aria-label={label}
        onClick={handler}
        ref={ref}
        className={cn(
          'reset-button inline-flex',
          !reduceMotion && [
            '[&_svg]:transition-[scale] [&_svg]:duration-[0.24s] [&_svg]:ease-in-out',
            'hover:[&_svg]:scale-110',
            'active:[&_svg]:scale-[0.85]',
          ],
          className
        )}
        {...restProps}
      >
        <span
          className="relative"
          style={{ width: size, height: size }}
        >
          <AnimatePresence>
            <motion.span
              className="absolute inset-0 leading-[0]"
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
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    );
  }
);
