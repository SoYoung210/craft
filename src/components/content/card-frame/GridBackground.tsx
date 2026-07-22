import { cn } from '@/utils/cn';

const GRID_CELL = 72;

const GRID_LINES =
  'linear-gradient(to right, rgba(13,13,13,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(13,13,13,0.035) 1px, transparent 1px)';

const SIDE_FADE =
  'linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)';
const BOTTOM_FADE =
  'linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%)';

type GridBackgroundProps = {
  className?: string;
  fade?: 'sides' | 'all';
};

export default function GridBackground({
  className = 'inset-0',
  fade = 'sides',
}: GridBackgroundProps = {}) {
  const mask = fade === 'all' ? `${SIDE_FADE}, ${BOTTOM_FADE}` : SIDE_FADE;

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute', className)}
      style={{
        backgroundImage: GRID_LINES,
        backgroundSize: `${GRID_CELL}px ${GRID_CELL}px`,
        backgroundPosition: 'center',
        maskImage: mask,
        WebkitMaskImage: mask,
        maskComposite: fade === 'all' ? 'intersect' : undefined,
        WebkitMaskComposite: fade === 'all' ? 'source-in' : undefined,
      }}
    />
  );
}
