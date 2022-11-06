import canvasConfetti, {
  CreateTypes,
  GlobalOptions,
  Options,
} from 'canvas-confetti';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function useConfetti(options?: GlobalOptions) {
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement | null>(
    null
  );
  const confetti = useRef<CreateTypes | null>(null);

  useEffect(() => {
    if (canvasElement == null) {
      return;
    }

    confetti.current = canvasConfetti.create(canvasElement, {
      resize: true,
      ...options,
    });
  }, [canvasElement, options]);

  const fire = useCallback((options: Options) => {
    if (confetti.current == null) {
      return;
    }

    confetti.current({ disableForReducedMotion: true, ...options });
  }, []);

  return [setCanvasElement, fire] as const;
}
