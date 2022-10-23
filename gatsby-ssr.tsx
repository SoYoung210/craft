import React from 'react';
import type { RenderBodyArgs } from 'gatsby';

import { getCssText } from './stitches.config';

export const onRenderBody = ({ setHeadComponents }: RenderBodyArgs) => {
  setHeadComponents([
    <style
      key="stitches"
      id="stitches"
      dangerouslySetInnerHTML={{ __html: getCssText() }}
    />,
  ]);
};
