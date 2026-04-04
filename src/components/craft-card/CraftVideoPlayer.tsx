'use client';

import { type CSSProperties, useRef, useState } from 'react';

interface CraftVideoPlayerProps {
  src: string;
  objectFit?: 'cover' | 'contain';
  videoStyle?: CSSProperties;
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

export function CraftVideoPlayer({
  src,
  objectFit = 'cover',
  videoStyle,
}: CraftVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlayback = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full"
        style={{ objectFit, ...videoStyle }}
      />
      <div
        className="video-placeholder absolute inset-0 h-full w-full"
        style={{ backgroundColor: 'inherit' }}
      />
      <button
        onClick={togglePlayback}
        className={`absolute bottom-3 left-3 z-20 flex size-8 items-center justify-center rounded-full bg-black/40 backdrop-blur-md transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none ${isPlaying ? 'opacity-0 group-hover/card:opacity-100' : 'opacity-100'}`}
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        {isPlaying ? (
          <PauseIcon className="size-3.5 text-white" />
        ) : (
          <PlayIcon className="size-3.5 text-white" />
        )}
      </button>
    </>
  );
}
