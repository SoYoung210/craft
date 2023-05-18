import { Primitive } from '@radix-ui/react-primitive';
import { ComponentProps, useEffect, useReducer, useState } from 'react';

import useInterval from '../../../hooks/useInterval';

import { alphanumericChars } from './constants';
import { useScrambleContentContext } from './context';

type PrimitiveDivProps = ComponentProps<typeof Primitive.div>;

interface ScrambleTextProps extends Omit<PrimitiveDivProps, 'children'> {
  children: string;
  size?: number;
  // internal usage
  __index?: number;
  onAnimationEnd?: () => void;
}

export default function ScrambleText({
  children,
  size = 8,
  __index = 0,
  ...restProps
}: ScrambleTextProps) {
  const { interval, completeIndexList, addCompleteIndex } =
    useScrambleContentContext('ScrambleContent.Text');

  const start = completeIndexList.some(index => index === __index - 1);
  const [scrambledText, setScrambledText] = useState(
    scrambleText(children.slice(0, size))
  );

  const [charIndex, increaseCharIndex] = useReducer(state => state + 1, 0);
  const finished = charIndex > children.length;
  const stop = !start || finished;

  useInterval(() => increaseCharIndex(), stop ? null : interval);
  useInterval(
    () => {
      const finishedText = children.slice(0, charIndex);
      const scrambled = scrambleText(
        children.slice(charIndex, charIndex + size)
      );
      setScrambledText(finishedText + scrambled);
    },
    stop ? null : interval
  );

  useEffect(() => {
    if (finished) {
      addCompleteIndex(__index);
    }
  }, [__index, finished, addCompleteIndex]);

  return (
    <Primitive.div
      {...restProps}
      style={{ flexShrink: 0, opacity: start ? 1 : 0, ...restProps.style }}
    >
      {scrambledText}
    </Primitive.div>
  );
}

const scrambleText = (text: string) => {
  const chars = text.split('');
  const scrambledChars = chars.map(char => {
    // Don't scramble whitespace
    if (/^\s$/.test(char)) {
      return char;
    }
    const randomIndex = Math.floor(Math.random() * alphanumericChars.length);
    return alphanumericChars[randomIndex];
  });
  return scrambledChars.join('');
};
