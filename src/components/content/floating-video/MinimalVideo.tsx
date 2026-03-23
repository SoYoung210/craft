import { motion } from 'motion/react';
import { ReactNode } from 'react';

import { cn } from '../../../utils/cn';
import { MaximizeIcon } from '../../material/icon/MaximizeIcon';

import { useViewportDragLimit } from './hooks/useViewportDragLimit';
import { FloatingIconRoot } from './shared/FloatingIcon';
import { VideoController } from './shared/VideoController';

interface MinimalVideoProps {
  width?: number | string;
  height?: number | string;
  playing: boolean;
  children: ReactNode;
  onPlayingChange: (playing: boolean) => void;
  onExpand: () => void;
}
const VIDEO_HEIGHT = 40;

export function MinimalVideo(props: MinimalVideoProps) {
  const {
    width = '500px',
    height = VIDEO_HEIGHT,
    playing,
    onPlayingChange,
    children,
    onExpand,
  } = props;

  const [dragRef, dragConstraints] = useViewportDragLimit();

  return (
    <VideoController
      asChild
      className={cn(
        'will-change-transform rounded-xl',
        'shadow-[rgba(0,0,0,0.12)_0px_0px_24px] overflow-hidden'
      )}
      style={{ height, width }}
    >
      <motion.div
        ref={dragRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          originX: 0.5,
          originY: 1,
        }}
        drag={true}
        dragMomentum={false}
        dragConstraints={dragConstraints}
        initial={{
          scale: 0.94,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        exit={{
          scale: 0.94,
          opacity: 0,
          originX: 0.5,
          originY: 0.5,
          transition: {
            delay: 0,
          },
        }}
        transition={{
          duration: 0.24,
          delay: 0.1,
        }}
      >
        {children}
        <FloatingIconRoot
          className="w-[30px] h-[30px]"
          asChild
        >
          <VideoController.PlayControl
            playing={playing}
            onPlayingChange={onPlayingChange}
            style={{ opacity: 'inherit', transition: 'none' }}
            reduceMotion={true}
            size={20}
          />
        </FloatingIconRoot>
        <FloatingIconRoot asChild>
          <button
            className={cn(
              'reset-button inline-flex w-[30px] h-[30px]',
              'absolute top-1.5 right-2.5 z-[1]',
              '[&_svg]:transition-transform [&_svg]:duration-200 [&_svg]:ease-in-out',
              'active:[&_svg]:scale-110'
            )}
            onClick={onExpand}
          >
            <MaximizeIcon size={20} color="white" />
          </button>
        </FloatingIconRoot>
      </motion.div>
    </VideoController>
  );
}
