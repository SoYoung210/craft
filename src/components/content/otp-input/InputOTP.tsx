'use client';

import {
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
} from 'react';
import { OTPInput, OTPInputContext } from 'input-otp';
import { animate, motion, useMotionValue } from 'motion/react';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';
import { createContext } from '@/components/utility/createContext';

function InputOTP({
  className,
  containerClassName,
  autoFocus = true,
  ...props
}: ComponentProps<typeof OTPInput>) {
  return (
    <OTPInput
      autoFocus={autoFocus}
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName
      )}
      className={cn('disabled:cursor-not-allowed', className)}
      {...props}
    />
  );
}

const springConfig = { stiffness: 480, damping: 50, mass: 1 };
const groupSpringConfig = { stiffness: 200, damping: 30, mass: 1 };

const MINT_GRADIENT =
  'linear-gradient(135deg, rgba(153,239,132,0.5), rgba(153,239,132,0.1))';
const ACCENT_GRADIENT =
  'linear-gradient(135deg, rgba(128,110,202,0.6), rgba(128,110,202,0.15))';
const PINK_GRADIENT =
  'linear-gradient(135deg, rgba(251,60,131,0.6), rgba(251,60,131,0.15))';
const BORDER_MASK =
  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)';

const ERROR_MERGED_HOLD = 800;

export type OtpVariant = 'dark' | 'light';

const [OtpStateProvider, useOtpState] = createContext<{
  hasError: boolean;
  isMergedError: boolean;
  variant: OtpVariant;
}>('OtpState');

function InputOTPGroup({
  ref,
  className,
  children,
  error = false,
  variant = 'dark',
  ...props
}: ComponentProps<'div'> & { error?: boolean; variant?: OtpVariant }) {
  const { slots } = useContext(OTPInputContext);
  const isComplete = slots.length > 0 && slots.every(s => s.char);

  const [prevError, setPrevError] = useState(error);
  const [mergedOnError, setMergedOnError] = useState(false);

  if (error !== prevError) {
    setPrevError(error);
    if (error && isComplete) {
      setMergedOnError(true);
    } else if (!error) {
      setMergedOnError(false);
    }
  }

  useEffect(() => {
    if (!mergedOnError) return;
    const timer = setTimeout(() => setMergedOnError(false), ERROR_MERGED_HOLD);
    return () => clearTimeout(timer);
  }, [mergedOnError]);

  const showMerged = isComplete && (!error || mergedOnError);
  const isMergedError = showMerged && error;

  return (
    <OtpStateProvider
      hasError={error}
      isMergedError={isMergedError}
      variant={variant}
    >
      <motion.div
        ref={ref}
        animate={{ scale: showMerged ? 0.95 : 1 }}
        transition={{ type: 'spring', ...groupSpringConfig }}
        className={cn(
          'relative flex w-full items-center gap-2 rounded-[22px] p-1',
          isMergedError && 'bg-[#fb3c83]/10',
          className
        )}
        {...(props as ComponentProps<typeof motion.div>)}
      >
        {children}
        {showMerged && (
          <div
            className="pointer-events-none absolute inset-0 rounded-[22px]"
            style={{
              padding: '2px',
              background: error
                ? PINK_GRADIENT
                : variant === 'light'
                  ? ACCENT_GRADIENT
                  : MINT_GRADIENT,
              mask: BORDER_MASK,
              WebkitMask: BORDER_MASK,
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
            }}
          />
        )}
      </motion.div>
    </OtpStateProvider>
  );
}

const slotVariants = cva(
  'relative flex h-16 flex-1 items-center justify-center rounded-[18px] border font-mono text-2xl',
  {
    variants: {
      variant: {
        dark: 'text-white',
        light: 'text-[#0d0d0d]',
      },
      state: {
        empty: '',
        filled: '',
        complete: 'border-transparent',
      },
    },
    compoundVariants: [
      {
        variant: 'dark',
        state: 'empty',
        className:
          'animate-[otp-wave_4s_ease-in-out_infinite_backwards] border-transparent',
      },
      {
        variant: 'dark',
        state: 'filled',
        className: 'border-[#99ef84]/50 bg-white/10',
      },
      {
        variant: 'light',
        state: 'empty',
        className: 'border-[#0d0d0d]/25 bg-[#0d0d0d]/5',
      },
      {
        variant: 'light',
        state: 'filled',
        className: 'border-[#0d0d0d]/25 bg-[#0d0d0d]/5',
      },
    ],
    defaultVariants: { variant: 'dark', state: 'empty' },
  }
);

const caretVariants = cva(
  'h-6 w-px animate-[otp-caret-blink_1.25s_ease-out_infinite]',
  {
    variants: {
      variant: {
        dark: 'bg-white',
        light: 'bg-[#0d0d0d]',
      },
    },
    defaultVariants: { variant: 'dark' },
  }
);

function InputOTPSlot({
  ref,
  index,
  className,
  ...props
}: ComponentProps<'div'> & { index: number }) {
  const inputOTPContext = useContext(OTPInputContext);
  const slot = inputOTPContext.slots[index];
  const prevCharRef = useRef<string | null>(null);

  const scale = useMotionValue(1);
  const { hasError, isMergedError, variant } = useOtpState('InputOTPSlot');

  useEffect(() => {
    if (slot?.char && !prevCharRef.current) {
      const controls = animate(scale, [0.92, 1], {
        type: 'spring',
        ...springConfig,
      });
      prevCharRef.current = slot?.char ?? null;
      return () => controls.stop();
    }
    prevCharRef.current = slot?.char ?? null;
  }, [slot?.char, scale]);

  if (!slot) return null;
  const { char, hasFakeCaret } = slot;

  const isFilled = !!char;
  const isComplete =
    inputOTPContext.slots.length > 0 &&
    inputOTPContext.slots.every(s => s.char);

  const state = isComplete ? 'complete' : isFilled ? 'filled' : 'empty';
  const errorBg =
    hasError && isFilled && !isMergedError ? 'bg-[#fb3c83]/10' : undefined;

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        ...(!isFilled && { animationDelay: `${index * 150}ms` }),
      }}
      className={cn(slotVariants({ variant, state }), errorBg, className)}
      {...(props as ComponentProps<typeof motion.div>)}
    >
      {char}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className={caretVariants({ variant })} />
        </div>
      )}
    </motion.div>
  );
}

function InputOTPSeparator(props: ComponentProps<'div'>) {
  return (
    <div role="separator" {...props}>
      <span className="text-white/50">-</span>
    </div>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
