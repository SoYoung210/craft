import { ReactNode } from 'react';

import CircleSquare from './illust/CircleSquare';
import Flower from './illust/Flower';

interface Props {
  type: 'flower' | 'circleSquare';
  children: ReactNode;
}

export default function IconSample(props: Props) {
  const { children, type } = props;

  switch (type) {
    case 'circleSquare': {
      return <CircleSquare>{children}</CircleSquare>;
    }
    default: {
      return <Flower>{children}</Flower>;
    }
  }
}
