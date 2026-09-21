'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useAnimate } from 'motion/react';

import { cn } from '@/utils/cn';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  type OtpVariant,
} from './InputOTP';

const CODE_LENGTH = 6;
const VALID_CODE = '123456';
const VERIFY_DELAY = 600;

const shakeKeyframes = [0, -3, 3, -3, 3, 0];
const shakeTransition = { duration: 0.3, ease: 'easeOut' as const };

type Status = 'idle' | 'verifying' | 'success';

interface Props {
  variant?: OtpVariant;
  autoFocus?: boolean;
}

export function OtpVerify({ variant = 'dark', autoFocus = false }: Props) {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [shakeScope, animateShake] = useAnimate();

  const isDark = variant === 'dark';
  const isComplete = value.length === CODE_LENGTH;
  const canSubmit = isComplete && status === 'idle';

  async function verify(code: string) {
    if (code.length !== CODE_LENGTH || status === 'verifying') return;
    setStatus('verifying');
    await new Promise(resolve => setTimeout(resolve, VERIFY_DELAY));
    if (code !== VALID_CODE) {
      setStatus('idle');
      setError('Invalid code. Please try again.');
      animateShake(shakeScope.current, { x: shakeKeyframes }, shakeTransition);
      return;
    }
    setStatus('success');
  }

  function reset() {
    setValue('');
    setError(null);
    setStatus('idle');
  }

  return (
    <div className="flex w-full max-w-[345px] flex-col items-center gap-2">
      <div ref={shakeScope} className="w-full">
        <InputOTP
          maxLength={CODE_LENGTH}
          value={value}
          autoFocus={autoFocus}
          containerClassName="w-full"
          onChange={next => {
            setValue(next);
            if (error) setError(null);
            if (status === 'success') setStatus('idle');
          }}
          onComplete={verify}
        >
          <InputOTPGroup error={!!error} variant={variant}>
            {Array.from({ length: CODE_LENGTH }, (_, i) => (
              <InputOTPSlot key={i} index={i} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="relative h-5 w-full">
        <AnimatePresence>
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-x-0 text-center font-mono text-xs text-[#fb3c83]"
            >
              {error}
            </motion.p>
          )}
          {status === 'success' && (
            <motion.p
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                'absolute inset-x-0 text-center font-mono text-xs',
                isDark ? 'text-[#99ef84]' : 'text-[#806eca]'
              )}
            >
              Verified
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={() => (status === 'success' ? reset() : verify(value))}
        disabled={!canSubmit && status !== 'success'}
        className={cn(
          'flex h-14 w-full cursor-pointer items-center justify-center rounded-[18px] text-[17px] font-medium transition-all disabled:cursor-not-allowed',
          canSubmit || status === 'success'
            ? isDark
              ? 'bg-white text-[#0d0d0d] hover:opacity-90'
              : 'bg-[#0d0d0d] text-white hover:opacity-90'
            : isDark
              ? 'bg-white/5 text-white/50'
              : 'bg-[#0d0d0d]/5 text-[#0d0d0d]/40'
        )}
      >
        {status === 'verifying'
          ? 'Verifying...'
          : status === 'success'
            ? 'Reset'
            : 'Continue'}
      </button>
    </div>
  );
}
