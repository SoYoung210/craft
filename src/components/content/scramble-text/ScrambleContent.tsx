import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  useCallback,
  useState,
} from 'react';

import { ScrambleContentProvider } from './context';
import ScrambleText from './ScrambleText';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement | ReactElement[];
  interval?: number;
}

/**
 *
 * @description ScrambleContent 하위에는 Scramble.Text컴포넌트로만 구성하는 것 추천
 */

export default function ScrambleContent({
  children,
  interval = 30,
  style,
  ...restProps
}: Props) {
  const [completeIndexList, setCompleteIndexList] = useState([-1]);
  const addCompleteIndex = useCallback((index: number) => {
    return setCompleteIndexList(prev => [...prev, index]);
  }, []);

  return (
    <ScrambleContentProvider
      interval={interval}
      completeIndexList={completeIndexList}
      addCompleteIndex={addCompleteIndex}
    >
      <div
        style={{ display: 'flex', flexWrap: 'wrap', ...style }}
        {...restProps}
      >
        {Children.toArray(children)
          .filter(isValidElement)
          .filter(isScrambleTextElement)
          .map((child, index) => {
            return cloneElement(child, {
              ...child.props,
              __index: index,
            });
          })}
      </div>
    </ScrambleContentProvider>
  );
}

function isScrambleTextElement(element: ReactElement): element is ReactElement {
  return element.type === ScrambleText;
}

ScrambleContent.Text = ScrambleText;
