import {
  Children,
  cloneElement,
  HTMLAttributes,
  isValidElement,
  ReactElement,
  useCallback,
  useState,
} from 'react';

import { RandomTextProvider } from './context';
import { RandomTextBlock } from './Block';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactElement | ReactElement[];
  interval?: number;
}

/**
 *
 * @description RadomText 하위에는 RandomText.Block컴포넌트로만 구성하는 것을 권장합니다.
 * Block이외의 컴포넌트를 사용해야 한다면 opacity를 직접 control해야 합니다.
 */
export default function RandomText({
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
    <RandomTextProvider
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
          .filter(isRandomTextBlockElement)
          .map((child, index) => {
            return cloneElement(child, {
              ...child.props,
              __index: index,
            });
          })}
      </div>
    </RandomTextProvider>
  );
}

function isRandomTextBlockElement(
  element: ReactElement
): element is ReactElement {
  return element.type === RandomTextBlock;
}

RandomText.Block = RandomTextBlock;
