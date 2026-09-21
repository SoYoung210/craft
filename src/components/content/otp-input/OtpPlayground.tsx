'use client';

import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Moon, Sun } from 'lucide-react';

import PageLayout from '@/components/layout/page-layout/PageLayout';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { cn } from '@/utils/cn';

import { type OtpVariant } from './InputOTP';
import { OtpVerify } from './OtpVerify';

const THEME_BACKGROUND: Record<OtpVariant, string> = {
  dark: '#0d0d0d',
  light: '#ffffff',
};

const TRANSITION_CLASS = 'otp-theme-transition';

export function OtpPlayground() {
  const [theme, setTheme] = useState<OtpVariant>('dark');
  const toggleRef = useRef<HTMLButtonElement>(null);
  const transitionRef = useRef<ViewTransition | null>(null);

  const isDark = theme === 'dark';

  useIsomorphicLayoutEffect(() => {
    const root = document.documentElement;
    root.style.backgroundColor = THEME_BACKGROUND[theme];
    return () => {
      root.style.backgroundColor = '';
    };
  }, [theme]);

  function toggleTheme() {
    const next: OtpVariant = isDark ? 'light' : 'dark';
    const toggle = toggleRef.current;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!document.startViewTransition || reduceMotion || !toggle) {
      setTheme(next);
      return;
    }

    const rect = toggle.getBoundingClientRect();
    const root = document.documentElement;
    root.style.setProperty('--otp-reveal-x', `${rect.left + rect.width / 2}px`);
    root.style.setProperty('--otp-reveal-y', `${rect.top + rect.height / 2}px`);
    root.classList.add(TRANSITION_CLASS);

    const transition = document.startViewTransition(() =>
      flushSync(() => setTheme(next))
    );
    transitionRef.current = transition;
    transition.finished.finally(() => {
      if (transitionRef.current !== transition) return;
      root.classList.remove(TRANSITION_CLASS);
      transitionRef.current = null;
    });
  }

  return (
    <div
      className={cn('min-h-dvh w-full', isDark ? 'bg-[#0d0d0d]' : 'bg-white')}
    >
      <PageLayout>
        <div className="flex items-center justify-between gap-4">
          <PageLayout.Title className={cn(isDark && 'text-white')}>
            OTP Input
          </PageLayout.Title>
          <button
            ref={toggleRef}
            type="button"
            aria-label={
              isDark ? 'Switch to light theme' : 'Switch to dark theme'
            }
            onMouseDown={event => event.preventDefault()}
            onClick={toggleTheme}
            className={cn(
              'flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors',
              isDark
                ? 'bg-white/10 text-white/70 hover:bg-white/15'
                : 'bg-black/5 text-black/60 hover:bg-black/10'
            )}
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
        </div>
        <p className={isDark ? 'text-white/50' : 'text-gray-6'}>
          Enter{' '}
          <span
            className={cn(
              'font-mono',
              isDark ? 'text-white/80' : 'text-gray-8'
            )}
          >
            123456
          </span>{' '}
          to verify. Any other code shows the error state.
        </p>
        <div className="flex justify-center pt-8">
          <OtpVerify variant={theme} autoFocus />
        </div>
      </PageLayout>
    </div>
  );
}
