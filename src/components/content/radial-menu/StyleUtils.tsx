import { motion } from 'framer-motion';
import { ComponentPropsWithoutRef } from 'react';

import { SIZE } from './constants';

export function Shadow(props: ComponentPropsWithoutRef<typeof motion.div>) {
  return (
    <div
      style={{
        position: 'absolute',
        width: SIZE,
        height: SIZE,
      }}
    >
      <motion.div
        {...props}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          borderRadius: 999,
          boxShadow: `rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`,
          ...props.style,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: SIZE + 8,
            height: SIZE + 8,
            borderRadius: 999,
            background: 'rgb(250,250,250)',
          }}
        />
      </motion.div>
    </div>
  );
}

export function InnerCircle() {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 140,
        height: 140,
        borderRadius: 999,
        background: 'rgb(250,250,250)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: 132,
          height: 132,
          borderRadius: 'inherit',
          border: '3px solid #fff',
        }}
      />
    </div>
  );
}
