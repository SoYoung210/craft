import { AnimatePresence, motion } from 'motion/react';

import { CSSUnit } from '../../../utils/type';
import Button, { ButtonProps } from '../../material/Button';

import BorderMask from './BorderMask';
import BorderTransformer from './BorderTransformer';

interface Props extends ButtonProps {
  animationActive?: boolean;
  duration?: number;
  borderWidth: number | `${number}${CSSUnit}`;
  activeBorderColor: string;
}
export default function BorderAnimationButton(props: Props) {
  const {
    children,
    animationActive,
    duration = 1400,
    activeBorderColor,
    ...buttonProps
  } = props;

  return (
    <Button
      variant="ghost"
      size="xlarge"
      className="border border-[rgba(0,0,0,0.08)] bg-gradient-to-tr from-[#18181b] to-[#27272a] text-gray-4 font-medium"
      {...buttonProps}
    >
      <BorderMask width={1}>
        <AnimatePresence>
          {animationActive && (
            <BorderTransformer duration={duration}>
              <motion.div
                className="w-full h-full blur-[8px]"
                style={{ background: activeBorderColor }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </BorderTransformer>
          )}
        </AnimatePresence>
      </BorderMask>
      {children}
    </Button>
  );
}
