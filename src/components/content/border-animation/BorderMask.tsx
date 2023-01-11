import { useState } from 'react';

import Box, { BoxProps } from '../../material/Box';
import { styled } from '../../../../stitches.config';
import { CSSUnit } from '../../../utils/type';

import { BorderAnimationProvider } from './context';

interface Props extends BoxProps {
  width: number | `${number}${CSSUnit}`;
  radius?: number | `${number}${CSSUnit}` | 'inherit';
}
export default function BorderMask(props: Props) {
  const [maskElement, setMaskElement] = useState<HTMLDivElement | null>(null);
  const { width, radius = 'inherit', children, ...boxProps } = props;
  const widthWithUnit = typeof width === 'number' ? `${width}px` : width;
  // +1px: material/Button's inset boxShadow
  const inset = `calc(-1 * ${widthWithUnit})`;

  return (
    <BorderAnimationProvider maskElement={maskElement}>
      <Root
        ref={setMaskElement}
        {...boxProps}
        css={{
          ...boxProps.css,
          inset,
          borderRadius: radius,
        }}
      >
        <Box css={{ position: 'absolute', inset }}>{children}</Box>
      </Root>
    </BorderAnimationProvider>
  );
}

const Root = styled(Box, {
  position: 'absolute',
  border: '1px solid transparent',
  // mask layer를 두개로 생성 (아래 레이어에서 움직이는 box를 border처럼 보여주는 역할로 사용)
  '-webkit-mask':
    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
  '-webkit-mask-composite': 'xor',
  // firefox만 지원
  maskComposite: 'exclude',
});
