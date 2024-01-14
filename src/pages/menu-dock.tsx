import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';

import { GRADIENT_IMAGES } from '../components/content/menu-dock/constant';
import { DockItem } from '../components/content/menu-dock/DockItem';
import MenuDock from '../components/content/menu-dock/MenuDock';
import PageLayout from '../components/layout/page-layout/PageLayout';

const variants: Variants = {
  enter: (direction: number) => {
    return {
      // x: direction > 0 ? 1000 : -1000,
      rotateY: 18,
      x: 280,
      y: 10,
      opacity: 0,
      scale: 0.9,
      transformPerspective: 400,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    y: 0,
    rotateY: 0,
    opacity: 1,
    scale: 1,
    transformPerspective: 400,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      // x: direction < 0 ? 1000 : -1000,
      x: -280,
      y: 10,
      rotateY: -18,
      opacity: 0,
      scale: 0.9,
      transformPerspective: 400,
    };
  },
};

export default function MenuDockPage() {
  const [index, setIndex] = useState(0);

  return (
    <PageLayout>
      <PageLayout.Title>Dock</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>-</PageLayout.Summary>
        <PageLayout.DetailsContent>-</PageLayout.DetailsContent>
      </PageLayout.Details>
      <div style={{ position: 'relative', height: 400, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              // src={image[0]}
              variants={variants}
              initial="enter"
              animate="center"
              style={{
                height: 240,
                width: 240,
                border: '1px solid',
                position: 'absolute',
                boxShadow: '0 8px 20px 0 rgba(108, 79, 197, 0.44)',
                borderRadius: 16,
                display: 'flex',
                alignItems: 'center',
              }}
              exit="exit"
              transition={{
                ease: [0.45, 0, 0.55, 1],
                duration: 0.45,
              }}
            >
              {index}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* 5개 기준한 값으로 변경 */}
        <div style={{ position: 'absolute', top: 180 }}>
          <MenuDock initialIndex={4}>
            {GRADIENT_IMAGES.map((src, index) => {
              return (
                <DockItem
                  key={index}
                  index={index}
                  onClick={() => {
                    setIndex(prev => prev + 1);
                  }}
                >
                  <img
                    src={src}
                    alt=""
                    style={{
                      width: '50%',
                      height: '50%',
                      borderRadius: 9999,
                      userSelect: 'none',
                    }}
                  />
                </DockItem>
              );
            })}
          </MenuDock>
        </div>
      </div>
    </PageLayout>
  );
}
