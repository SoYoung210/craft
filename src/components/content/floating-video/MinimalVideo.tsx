import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import { css, styled } from '../../../../stitches.config';
import { withUnit } from '../../../utils/css';
import { MaximizeIcon } from '../../material/icon/MaximizeIcon';

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

  return (
    <VideoController
      asChild
      className={css({
        height,
        width,
        willChange: 'transform',
        borderRadius: 12,
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 0px 24px',
        overflow: 'hidden',
        // TODO: move to motion.div
      })()}
    >
      <motion.div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          originX: 0.5,
          originY: 1,
        }}
        drag={true}
        dragMomentum={false}
        // FIXME: 오른쪽도 window size맞춰서 잡아주기
        dragConstraints={{ left: 0, bottom: 0 }}
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
        <FloatingIconRoot css={{ size: 30 }} asChild>
          <VideoController.PlayControl
            playing={playing}
            onPlayingChange={onPlayingChange}
            style={{ opacity: 'inherit', transition: 'none' }}
            reduceMotion={true}
            size={20}
          />
        </FloatingIconRoot>
        <FloatingIconRoot asChild>
          <MaximizeButton onClick={onExpand}>
            <MaximizeIcon size={20} color="white" />
          </MaximizeButton>
        </FloatingIconRoot>
      </motion.div>
    </VideoController>
  );
}

const MaximizeButton = styled('button', {
  resetButton: 'inline-flex',
  size: 30,
  position: 'absolute',
  top: 6,
  right: 10,
  zIndex: 1,
  svg: {
    transition: 'transform 0.2s ease-in-out',
  },
  '&:active': {
    svg: {
      transform: 'scale(1.1)',
    },
  },
});
