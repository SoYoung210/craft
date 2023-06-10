import { motion } from 'framer-motion';
import { ReactNode } from 'react';

import { css } from '../../../../stitches.config';
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
    width = '50vw',
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
          scale: 0.8,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          type: 'ease',
          duration: 0.24,
          delay: 0.1,
        }}
      >
        {children}
        <FloatingIconRoot css={{ size: 30 }} asChild>
          <VideoController.PlayControl
            playing={playing}
            onPlayingChange={onPlayingChange}
            style={{ opacity: 1, transition: 'none' }}
            reduceMotion={true}
            size={20}
          />
        </FloatingIconRoot>
        <FloatingIconRoot asChild>
          <button
            className={css({
              resetButton: 'inline-flex',
              size: 30,
              position: 'absolute',
              top: 6,
              right: 10,
              zIndex: 1,
            })()}
          >
            <MaximizeIcon size={20} onClick={onExpand} color="white" />
          </button>
        </FloatingIconRoot>
      </motion.div>
    </VideoController>
  );
}
