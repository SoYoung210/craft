import { useCallback, useState } from 'react';

import { random } from '../../../../utils/number';

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
  const result = random(min, max);

  if (result === current) {
    return random(min, max);
  }

  return result;
}
