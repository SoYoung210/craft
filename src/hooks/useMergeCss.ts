import { useMemo } from 'react';

import { StitchesCssType } from '../../stitches.config';

export default function useMergeCss(...css: (StitchesCssType | undefined)[]) {
  return useMemo(() => {
    return css.reduce((acc, curr) => {
      if (curr == null) {
        return acc;
      }
      return {
        ...acc,
        ...curr,
      };
    }, {});
  }, [css]);
}
