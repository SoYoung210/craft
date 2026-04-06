'use client';

import {
  type CSSProperties,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';

import { VIDEO_POSTERS } from '@/app/_data/video-posters';
import { cn } from '@/utils/cn';

interface ModalVideoPlayerProps {
  src: string;
  poster?: string;
  objectFit?: 'cover' | 'contain';
  videoStyle?: CSSProperties;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function useVideoPlayer(videoRef: RefObject<HTMLVideoElement | null>) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolumeState] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoaded = () => setDuration(video.duration);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoaded);

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [videoRef]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [videoRef]);

  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const video = videoRef.current;
      if (!video) return;
      if (video.muted || video.volume === 0) {
        video.muted = false;
        const restored = volume > 0 ? volume : 0.5;
        video.volume = restored;
        setVolumeState(restored);
        setIsMuted(false);
      } else {
        video.muted = true;
        setIsMuted(true);
      }
    },
    [videoRef, volume]
  );

  const setVolume = useCallback(
    (val: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.volume = val;
      video.muted = val === 0;
      setVolumeState(val);
      setIsMuted(val === 0);
    },
    [videoRef]
  );

  const seek = useCallback(
    (time: number) => {
      const video = videoRef.current;
      if (!video) return;
      video.currentTime = time;
      setCurrentTime(time);
    },
    [videoRef]
  );

  return {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    setVolume,
    seek,
  };
}

export function ModalVideoPlayer({
  src,
  objectFit = 'cover',
  videoStyle,
}: ModalVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isTouchRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const [videoLoaded, setVideoLoaded] = useState(false);
  const [mobileControlsVisible, setMobileControlsVisible] = useState(false);

  const player = useVideoPlayer(videoRef);
  const poster = VIDEO_POSTERS[src];

  const showMobileControls = useCallback(() => {
    setMobileControlsVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(
      () => setMobileControlsVisible(false),
      3000
    );
  }, []);

  const { togglePlay } = player;
  const handleContainerClick = useCallback(() => {
    if (isTouchRef.current) {
      isTouchRef.current = false;
      showMobileControls();
      return;
    }
    togglePlay();
  }, [togglePlay, showMobileControls]);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  return (
    <div
      className="group/player absolute inset-0"
      onTouchStart={() => {
        isTouchRef.current = true;
      }}
      onClick={handleContainerClick}
    >
      {poster && (
        <img
          aria-hidden="true"
          src={`data:image/png;base64,${poster}`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{
            filter: 'blur(32px)',
            transform: 'scale(1.1) translateZ(0)',
            opacity: videoLoaded ? 0 : 1,
          }}
        />
      )}

      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full"
        playsInline
        autoPlay
        muted
        loop
        preload="auto"
        style={{
          objectFit,
          ...videoStyle,
          opacity: videoLoaded ? 1 : 0,
          transition: 'opacity 700ms',
        }}
        onLoadedData={() => setVideoLoaded(true)}
      >
        <source src={src} type="video/mp4" />
      </video>

      <div
        className={cn(
          'absolute inset-0 flex items-end px-5 pb-5 transition-opacity duration-300',
          'lg:opacity-0 lg:group-hover/player:opacity-100',
          mobileControlsVisible ? 'opacity-100' : 'opacity-0 lg:opacity-0'
        )}
        style={{
          background:
            'linear-gradient(to top in oklab, oklab(0 0 0/.7) 0%, oklab(0 0 0/.65) 16px, oklab(0 0 0/.55) 40px, oklab(0 0 0/.4) 64px, oklab(0 0 0/.25) 96px, oklab(0 0 0/.12) 130px, oklab(0 0 0/.04) 160px, transparent 200px)',
        }}
        onClick={e => e.stopPropagation()}
        onTouchStart={e => {
          e.stopPropagation();
          showMobileControls();
        }}
      >
        <div className="flex w-full flex-col gap-1.5 lg:gap-3">
          <SeekBar
            duration={player.duration}
            currentTime={player.currentTime}
            onSeek={player.seek}
          />

          <div className="flex items-center gap-4">
            <button
              onClick={e => {
                e.stopPropagation();
                player.togglePlay();
              }}
              className="flex shrink-0 items-center justify-center text-white/90 transition-colors hover:text-white"
              aria-label={player.isPlaying ? 'Pause' : 'Play'}
            >
              {player.isPlaying ? (
                <PauseIcon className="size-5" />
              ) : (
                <PlayIcon className="size-5" />
              )}
            </button>

            <VolumeControl
              isMuted={player.isMuted}
              volume={player.volume}
              onToggleMute={player.toggleMute}
              onVolumeChange={player.setVolume}
            />

            <span className="font-mono text-[13px] leading-none tabular-nums text-white/90">
              {formatTime(player.currentTime)}
            </span>

            <span className="ml-auto font-mono text-[13px] leading-none tabular-nums text-white/50">
              -{formatTime(Math.max(0, player.duration - player.currentTime))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SeekBarProps {
  duration: number;
  currentTime: number;
  onSeek: (time: number) => void;
}

function SeekBar({ duration, currentTime, onSeek }: SeekBarProps) {
  const seekRef = useRef<HTMLDivElement>(null);
  const [hoverRatio, setHoverRatio] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragRatio, setDragRatio] = useState<number | null>(null);

  const getRatioFromClientX = useCallback(
    (clientX: number) => {
      const bar = seekRef.current;
      if (!bar || !duration) return null;
      const rect = bar.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    },
    [duration]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
      const ratio = getRatioFromClientX(e.clientX);
      if (ratio !== null) {
        setDragRatio(ratio);
        onSeek(ratio * duration);
      }
    },
    [getRatioFromClientX, duration, onSeek]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const ratio = getRatioFromClientX(e.clientX);
      if (ratio !== null) {
        setHoverRatio(ratio);
        if (isDragging) {
          setDragRatio(ratio);
          onSeek(ratio * duration);
        }
      }
    },
    [getRatioFromClientX, isDragging, duration, onSeek]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setDragRatio(null);
  }, []);

  const displayRatio = isDragging && dragRatio !== null ? dragRatio : null;
  const progress = duration
    ? (displayRatio !== null ? displayRatio : currentTime / duration) * 100
    : 0;

  return (
    <div
      ref={seekRef}
      className="relative w-full cursor-pointer py-5 touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseLeave={() => {
        if (!isDragging) setHoverRatio(null);
      }}
      role="slider"
      aria-label="Seek"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
      tabIndex={0}
    >
      <div className="relative h-[2px] w-full bg-white/30">
        <div
          className="absolute inset-y-0 left-0 bg-white/80"
          style={{ width: `${progress}%` }}
        />
      </div>

      {(hoverRatio !== null || isDragging) && (
        <>
          <div
            className="absolute top-1/2 h-5 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
            style={{
              left: `${(isDragging ? (dragRatio ?? 0) : (hoverRatio ?? 0)) * 100}%`,
            }}
          />
          <div
            className="absolute bottom-full mb-2 -translate-x-1/2 whitespace-nowrap font-mono text-[11px] tabular-nums text-white/90"
            style={{
              left: `${(isDragging ? (dragRatio ?? 0) : (hoverRatio ?? 0)) * 100}%`,
            }}
          >
            {formatTime(
              (isDragging ? (dragRatio ?? 0) : (hoverRatio ?? 0)) * duration
            )}{' '}
            / {formatTime(duration)}
          </div>
        </>
      )}
    </div>
  );
}

interface VolumeControlProps {
  isMuted: boolean;
  volume: number;
  onToggleMute: (e: React.MouseEvent) => void;
  onVolumeChange: (val: number) => void;
}

function VolumeControl({
  isMuted,
  volume,
  onToggleMute,
  onVolumeChange,
}: VolumeControlProps) {
  const [showSlider, setShowSlider] = useState(false);

  return (
    <div
      className="relative flex shrink-0 items-center"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={() => setShowSlider(false)}
    >
      <button
        onClick={onToggleMute}
        className="flex items-center text-white/90 transition-colors hover:text-white"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted || volume === 0 ? (
          <VolumeMutedIcon className="size-[18px]" />
        ) : volume < 0.5 ? (
          <VolumeLowIcon className="size-[18px]" />
        ) : (
          <VolumeFullIcon className="size-[18px]" />
        )}
      </button>

      <AnimatePresence>
        {showSlider && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 mb-3 flex -translate-x-1/2 flex-col items-center rounded-xl bg-white/20 p-2.5 shadow-lg backdrop-blur-xl"
            onClick={e => e.stopPropagation()}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={e => onVolumeChange(Number(e.target.value))}
              className="volume-slider h-[80px] w-1 cursor-pointer appearance-none"
              style={{ writingMode: 'vertical-lr', direction: 'rtl' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.00056 20.6664C6.66722 21.4368 5 20.4746 5 18.9347V5.06549C5 3.5256 6.66722 2.56338 8.00055 3.33375L20.0028 10.2684C21.3354 11.0383 21.3354 12.9619 20.0028 13.7318L8.00056 20.6664Z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8.28571 4H5.71429C4.76751 4 4 4.89543 4 6V18C4 19.1046 4.76751 20 5.71429 20H8.28571C9.23249 20 10 19.1046 10 18V6C10 4.89543 9.23249 4 8.28571 4Z" />
      <path d="M18.2857 4H15.7143C14.7675 4 14 4.89543 14 6V18C14 19.1046 14.7675 20 15.7143 20H18.2857C19.2325 20 20 19.1046 20 18V6C20 4.89543 19.2325 4 18.2857 4Z" />
    </svg>
  );
}

function VolumeMutedIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function VolumeLowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  );
}

function VolumeFullIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 010 14.14" />
      <path d="M15.54 8.46a5 5 0 010 7.07" />
    </svg>
  );
}
