import { Expo, gsap, SteppedEase, Power4, Power3 } from 'gsap';
import {
  Children,
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { css } from '../../../../stitches.config';
import { withUnit } from '../../../utils/css';

import { splitText } from './splitText';

interface TypingTextProps extends HTMLAttributes<HTMLDivElement> {
  blinkCount?: number;
  children: React.ReactNode;
  fontSize?: string | number;
  highlightColor?: string;
}

const LINE_HEIGHT = 1.3;
const REPEAT_DELAY = 0.3;
export default function TypingText({
  children,
  fontSize = 40,
  blinkCount = 5,
  highlightColor = '#17c0fd',
  style,
  ...restProps
}: TypingTextProps) {
  const tl = useRef(gsap.timeline({ delay: 0.2 }));

  const bar = useRef<HTMLDivElement>(null);
  const text1 = useRef<HTMLDivElement>(null);
  const text2 = useRef<HTMLDivElement>(null);

  const moveBar = useCallback(() => {
    gsap.set(bar.current, {
      left: gsap.getProperty(text1.current, 'width'),
    });
  }, []);

  useEffect(() => {
    const copied = tl.current;
    copied
      .set(text1.current, {
        color: '#fff',
        fontWeight: 'regular',
      })
      .set(text2.current, {
        color: highlightColor,
        fontWeight: 'bold',
        opacity: 1,
        immediateRender: true,
      })
      .set(bar.current, {
        left: 1,
        backgroundColor: '#fff',
        immediateRender: true,
      })
      .to(bar.current, {
        duration: 0.1,
        opacity: 0,
        ease: Expo.easeInOut,
        yoyo: true,
        repeat: blinkCount,
        repeatDelay: REPEAT_DELAY,
      })
      .from(text1.current, {
        duration: 1.1,
        width: 0,
        ease: SteppedEase.config(14),
        onUpdate: moveBar,
      })
      .to(bar.current, { duration: 0.05, backgroundColor: highlightColor })
      .to(bar.current, { duration: 1.0, width: 290, ease: Power4.easeInOut })
      .to(bar.current, { duration: 0.4, x: 290, width: 0, ease: Power4.easeIn })
      // https://codepen.io/lukePeavey/pen/XWZMYJx?editors=1010
      .from(
        splitText('#text2').chars,
        { duration: 0.6, opacity: 0, ease: Power3.easeInOut, stagger: 0.02 },
        // 이건 앞쪽으로 끼워넣어야..
        '-=0.5'
      )
      .to(text1.current, {
        duration: 1.5,
        opacity: 0.25,
        ease: Power3.easeInOut,
      })
      .timeScale(1.45);

    copied.play();

    return () => {
      copied.reverse();
    };
  }, [blinkCount, highlightColor, moveBar]);

  const [firstChild, ...restChild] = Children.toArray(children);

  return (
    <div
      ref={el => el}
      style={{
        position: 'relative',
        height: `calc(${withUnit(fontSize)} * ${LINE_HEIGHT})`,
        width: '100%',
        fontFamily: '"Red Hat Display"',
        fontSize,
        overflow: 'hidden',
        ...style,
      }}
      // for ios a11y
      role="text"
      // for android a11y
      tabIndex={0}
      {...restProps}
    >
      <div
        ref={text1}
        style={{
          overflow: 'hidden',
          display: 'inline-block',
        }}
      >
        {firstChild}
        {/* github.com */}
      </div>
      <div
        ref={text2}
        id="text2"
        style={{ position: 'absolute', display: 'inline-block' }}
      >
        {restChild}
      </div>
      <Bar ref={bar} fontSize={withUnit(fontSize)} />
    </div>
  );
}

interface HighlightProps {
  children: React.ReactNode;
}
const Highlight = ({ children }: HighlightProps) => {
  return <span>{children}</span>;
};

interface BarProps extends HTMLAttributes<HTMLDivElement> {
  fontSize: string;
}
const Bar = forwardRef<HTMLDivElement, BarProps>((props, ref) => {
  const { fontSize, ...restProps } = props;

  return (
    <span
      ref={ref}
      role="presentation"
      className={css({
        width: '3px',
        height: `calc(${fontSize} * ${LINE_HEIGHT})`,
        position: 'absolute',
        top: -1,
      })()}
      {...restProps}
    />
  );
});

TypingText.Highlight = Highlight;
