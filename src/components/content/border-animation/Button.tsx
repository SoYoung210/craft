import { AnimatePresence, motion } from 'framer-motion';

import { styled } from '../../../../stitches.config';
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
      css={{
        border: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundImage: 'linear-gradient(to top right, #18181b, #27272a)',
        color: '$gray4',
        fontWeight: 500,
      }}
      {...buttonProps}
    >
      <BorderMask width={1}>
        <AnimatePresence>
          {animationActive && (
            <BorderTransformer duration={duration}>
              <MotionBox
                css={{
                  width: '100%',
                  height: '100%',
                  background: activeBorderColor,
                  filter: 'blur(8px)',
                }}
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

const MotionBox = styled(motion.div);
