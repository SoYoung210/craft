import { useId as useIdFromReact } from 'react';

export default function useId(deterministicId?: string) {
  const id = useIdFromReact();

  return deterministicId ?? id;
}
