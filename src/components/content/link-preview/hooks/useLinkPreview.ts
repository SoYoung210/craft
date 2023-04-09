import { useCallback, useEffect, useState } from 'react';

import useCallbackRef from '../../../../hooks/useCallbackRef';
import { ensureUrlPrefix, getScreenshot } from '../utils';

type PreviewData = string;
interface Options {
  initialData?: PreviewData;
  onError?: (error: Error) => void;
}
export function useLinkPreview(link: string, options: Options = {}) {
  const { initialData, onError } = options;
  const handleError = useCallbackRef(onError);
  const [linkPreview, setLinkPreview] = useState(initialData);

  const fetchData = useCallback(
    async (value: string, signal: AbortSignal) => {
      try {
        const preview = await getScreenshot(ensureUrlPrefix(value), { signal });
        setLinkPreview(preview);
      } catch (error) {
        handleError(error as Error);
      }
    },
    [handleError]
  );

  useEffect(() => {
    const controller = new AbortController();
    if (options.initialData == null) {
      fetchData(link, controller.signal);
    }
    return () => {
      controller.abort();
    };
  }, [fetchData, link, options.initialData]);

  return [linkPreview, setLinkPreview] as const;
}
