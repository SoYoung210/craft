import { Expo, gsap, SteppedEase, Power4, Power3 } from 'gsap';
import { forwardRef, useCallback, useRef } from 'react';

import { css } from '../../../../stitches.config';
import { useIsomorphicLayoutEffect } from '../../../hooks/useIsomorphicLayoutEffect';

import { splitText } from './splitText';

/**
 * <TypeText>
 *  github.com/
 *  <TypeText.Highlight>SoYoung210</TypeText.Highlight>
 * </TypeText>
 */
export default function TypeText() {
  const bar = useRef<HTMLDivElement>(null);
  const text1 = useRef<HTMLDivElement>(null);
  const text2 = useRef<HTMLDivElement>(null);

  const moveBar = useCallback(() => {
    gsap.set(bar.current, {
      left: gsap.getProperty(text1.current, 'width'),
    });
  }, []);

  useIsomorphicLayoutEffect(() => {
    gsap
      .timeline({ delay: 0.2 })
      .set(text1.current, {
        color: '#fff',
        fontWeight: 'regular',
      })
      .set(text2.current, {
        color: '#17c0fd',
        fontWeight: 'bold',
        opacity: 1,
        // x: Number(gsap.getProperty(text1.current, 'width')) - 2,
        immediateRender: true,
      })
      // init;
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
        // yoyoEase: true,
        // 횟수에 따라 계산되는  무언가가 있음.
        repeat: 5,
        repeatDelay: 0.3,
      })
      // TODO: width 0 -> config 14,, 인데 position이 2.5?
      .from(
        text1.current,
        {
          duration: 1.1,
          width: 0,
          ease: SteppedEase.config(14),
          onUpdate: moveBar,
        },
        2.5
      )
      .to(bar.current, { duration: 0.05, backgroundColor: '#17c0fd' }, '+=0.15')
      .to(
        bar.current,
        { duration: 1.0, width: 290, ease: Power4.easeInOut },
        '+=0.1'
      )
      // .from(
      //   '.container',
      //   { duration: 1.0, x: 135, ease: Power4.easeInOut },
      //   '-=1.0'
      // )
      .to(text2.current, { duration: 0.01, opacity: 1 }, '-=0.1')
      .to(bar.current, { duration: 0.4, x: 290, width: 0, ease: Power4.easeIn })
      // https://codepen.io/lukePeavey/pen/XWZMYJx?editors=1010
      .from(
        splitText('#text2').chars,
        { duration: 0.6, opacity: 0, ease: Power3.easeInOut, stagger: 0.02 },
        '-=0.5'
      )
      .to(
        text1.current,
        { duration: 1.5, opacity: 0.25, ease: Power3.easeInOut },
        '-=1.2'
      )
      .timeScale(1.45);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        height: 53,
        width: '100%',
        fontFamily: 'Red Hat Display',
      }}
    >
      <div ref={text1} style={{ overflow: 'hidden', display: 'inline-block' }}>
        github.com/
      </div>
      <div
        ref={text2}
        id="text2"
        style={{ position: 'absolute', display: 'inline-block' }}
      >
        SoYoung210
      </div>
      <Bar ref={bar} />
    </div>
  );
}

// TODO: fontSize에 따라 결정되도록 하면 좋을듯?
const Bar = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <span
      ref={ref}
      role="presentation"
      className={css({
        width: '3px',
        height: '50px',
        position: 'absolute',
        top: -1,
      })()}
      {...props}
    />
  );
});
