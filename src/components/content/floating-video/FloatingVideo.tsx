import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useRef, useState } from 'react';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { useComposedRefs } from '@radix-ui/react-compose-refs';

import { cn } from '../../../utils/cn';
import { ArrowUpLeft } from '../../material/icon/ArrowUpLeft';
import { Underline } from '../../material/icon/Underline';
import { HStack } from '../../material/Stack';
import { RequiredKeys } from '../../../utils/type';
import { useBooleanState } from '../../../hooks/useBooleanState';

import { VideoController } from './shared/VideoController';
import { Slider } from './Slider';
import { MinimalVideo } from './MinimalVideo';
import { FloatingIconRoot } from './shared/FloatingIcon';
import { useViewportDragLimit } from './hooks/useViewportDragLimit';

const DEFAULT_WIDTH = 384;
const MIN_SIZE = 342;
const MINIMAL_VIDEO_HEIGHT = 40;

interface FloatingVideoProps extends RequiredKeys<ReactPlayerProps, 'playing'> {
  onPlayingChange: (playing: boolean) => void;
  addPlayer: (player: ReactPlayer) => void;
  played: number;
  defaultWidth?: number;
  onSeekingChange: (v: number) => void;
  onSeekMouseDown: () => void;
  onSeekMouseUp: () => void;
  aspectRatio: string;
}

export function FloatingVideo(props: FloatingVideoProps) {
  const {
    controls = false,
    playing = false,
    onPlayingChange,
    addPlayer,
    played,
    onSeekingChange,
    onSeekMouseDown,
    onSeekMouseUp,
    defaultWidth = DEFAULT_WIDTH,
    aspectRatio,
    ...restProps
  } = props;
  const [canDrag, setCanDrag] = useState(true);
  const [dragRef, dragConstraints] = useViewportDragLimit();
  const floatingContainerRef = useRef<HTMLDivElement>(null);
  const combinedRefs = useComposedRefs(dragRef, floatingContainerRef);

  const [width, setWidth] = useState(defaultWidth);
  const [minimize, setMinimize, setExpand] = useBooleanState(false);

  const floatingVideoHeight = 'unset';
  const floatingVideoRootHeight = minimize ? MINIMAL_VIDEO_HEIGHT : 'auto';

  const player = useMemo(() => {
    return (
      <ReactPlayer
        width="100%"
        ref={addPlayer}
        height={floatingVideoHeight}
        controls={controls}
        playing={playing}
        onPlay={() => onPlayingChange(true)}
        onPause={() => onPlayingChange(false)}
        playsinline={true}
        {...restProps}
      />
    );
  }, [
    addPlayer,
    controls,
    floatingVideoHeight,
    onPlayingChange,
    playing,
    restProps,
  ]);

  return (
    <AnimatePresence>
      {minimize ? (
        <MinimalVideo
          key="minimal"
          playing={playing}
          onPlayingChange={onPlayingChange}
          onExpand={setExpand}
          width={width}
          height={MINIMAL_VIDEO_HEIGHT}
        >
          {player}
        </MinimalVideo>
      ) : (
        <VideoController
          key="floating"
          asChild
          data-todo-role="floating-video-root"
          className={cn(
            'fixed bottom-0 left-0 will-change-transform rounded-xl',
            'shadow-[rgba(0,0,0,0.12)_0px_0px_24px] overflow-hidden'
          )}
          style={{
            height: floatingVideoRootHeight,
            width: `min(${width}px, 80vw)`,
            aspectRatio,
          }}
        >
          <motion.div
            style={{
              originX: 0.5,
              originY: 1,
            }}
            ref={combinedRefs}
            drag={canDrag}
            dragMomentum={false}
            dragConstraints={dragConstraints}
            initial={{
              filter: 'blur(6px)',
              scale: 0.4,
            }}
            animate={{
              filter: 'blur(0px)',
              scale: 1,
            }}
            exit={{
              filter: 'blur(6px)',
              opacity: 0.5,
              scale: 0.92,
              height: MINIMAL_VIDEO_HEIGHT,
              y: 100,
            }}
            transition={{
              duration: 0.2,
            }}
            onDragEnd={() => {
              setCanDrag(true);
            }}
          >
            {player}
            <VideoController.PlayControl
              playing={playing}
              onPlayingChange={onPlayingChange}
              size={80}
            />
            <VideoController.BottomControlContainer>
              <Slider
                data-todo-role="floating-video-slider"
                width="100%"
                value={played}
                onValueChange={onSeekingChange}
                max={0.999999}
                draggable={false}
                onPointerDown={() => {
                  setCanDrag(false);
                  onSeekMouseDown();
                }}
                onPointerUp={() => {
                  setCanDrag(true);
                  onSeekMouseUp();
                }}
              />
            </VideoController.BottomControlContainer>
            <HStack
              gap={8}
              className="absolute top-2.5 right-2.5 z-[1]"
            >
              <FloatingIconRoot asChild>
                <motion.button
                  className={cn(
                    'reset-button flex',
                    '[&_svg_path]:transition-transform [&_svg_path]:duration-200 [&_svg_path]:ease-in-out',
                    'active:[&_svg_path]:translate-y-1'
                  )}
                  onClick={setMinimize}
                >
                  <Underline color="white" />
                </motion.button>
              </FloatingIconRoot>
              <FloatingIconRoot asChild>
                <motion.button
                  className={cn(
                    'reset-button flex cursor-ne-resize',
                    '[&_svg]:rotate-45',
                    '[&_svg_path]:transition-transform [&_svg_path]:duration-200 [&_svg_path]:ease-in-out',
                    '[&_svg_path:last-of-type]:origin-center',
                    'active:[&_svg_path:first-of-type]:-translate-y-1',
                    'active:[&_svg_path:last-of-type]:scale-y-[1.3] active:[&_svg_path:last-of-type]:-translate-y-0.5'
                  )}
                  drag={true}
                  onDrag={(event, info) => {
                    const offset = getBiggerOffset(info.delta.x, info.delta.y);

                    const originWidth =
                      floatingContainerRef.current?.offsetWidth;

                    if (originWidth != null) {
                      setWidth(Math.max(offset + originWidth, MIN_SIZE));
                    }
                  }}
                  dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                  dragElastic={0}
                  dragMomentum={false}
                >
                  <ArrowUpLeft color="white" />
                </motion.button>
              </FloatingIconRoot>
            </HStack>
          </motion.div>
        </VideoController>
      )}
    </AnimatePresence>
  );
}

/**
 *
 * @param x 양수: 우측으로 움직임 / 음수: 왼쪽으로 움직임
 * @param y 양수: 아래로 / 음수: 위로
 * @returns
 */
function getBiggerOffset(x: number, y: number) {
  const toIncrease = x > 0 || y < 0;
  const offset = Math.abs(x) > Math.abs(y) ? x : y;

  return toIncrease ? toPositive(offset) : toNegative(offset);
}

function toPositive(num: number) {
  return num > 0 ? num : -num;
}

function toNegative(num: number) {
  return num < 0 ? num : -num;
}
