import { useCallback, useState } from 'react';

type PrimitiveData = string | number;
interface Options {
  min?: number;
  max?: number;
}
export default function useShuffleResource<T extends PrimitiveData>(
  resources: readonly T[],
  options: Options = {}
) {
  const { min = 0, max = resources.length - 1 } = options;
  const [index, setIndex] = useState(min);

  const shuffle = useCallback(() => {
    setIndex(prev => {
      return shuffledIndex(min, max, prev);
    });
  }, [max, min]);

  return [resources[index], shuffle] as const;
}

function shuffledIndex(min: number, max: number, current: number) {
  const result = rand(min, max);

  if (result === current) {
    return rand(min, max);
  }

  return result;
}
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
