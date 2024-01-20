import { AnimatePresence, motion, Variants } from 'framer-motion';
import { useState } from 'react';

import { GRADIENT_IMAGES } from '../components/content/menu-dock/constant';
import { DockItem } from '../components/content/menu-dock/DockItem';
import MenuDock from '../components/content/menu-dock/MenuDock';
import PageLayout from '../components/layout/page-layout/PageLayout';
import { usePrevious } from '../hooks/usePrevious';

const xAmount = 290;
const yAmount = 40;
const yRotate = 18;
const x = {
  left: -1 * xAmount,
  right: xAmount,
};

const rotateY = {
  right: yRotate,
  left: -1 * yRotate,
};
interface AnimateParams {
  direction: number;
}

const variants: Variants = {
  enter: ({ direction }: AnimateParams) => {
    return {
      x: direction > 0 ? x.left : x.right,
      rotateY: direction > 0 ? rotateY.left : rotateY.right,
      y: yAmount,
      opacity: 0,
      scale: 0.85,
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
  exit: ({ direction }: AnimateParams) => {
    return {
      zIndex: 0,
      x: direction > 0 ? x.right : x.left,
      y: yAmount,
      rotateY: direction < 0 ? rotateY.left : rotateY.right,
      opacity: 0,
      scale: 0.85,
      transformPerspective: 400,
    };
  },
};

export default function MenuDockPage() {
  const [index, setIndex] = useState(4);
  const previousIndex = usePrevious(index);
  const direction = previousIndex > index ? -1 : 1;

  return (
    <PageLayout style={{ minWidth: 760 }}>
      <PageLayout.Title>Dock</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>-</PageLayout.Summary>
        <PageLayout.DetailsContent>-</PageLayout.DetailsContent>
      </PageLayout.Details>
      <div
        style={{
          position: 'relative',
          // height: 480,
          height: 420,
          overflow: 'hidden',
          paddingTop: 16,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AnimatePresence initial={false}>
            <motion.div
              key={index}
              variants={variants}
              initial="enter"
              custom={{ direction }}
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
                opacity: { duration: 0.3 },
              }}
            >
              {index}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* 5개 기준한 값으로 변경 */}
        <div style={{ position: 'absolute', top: 320 }}>
          <MenuDock initialIndex={2}>
            <svg
              width="632"
              height="119"
              viewBox="0 0 632 119"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M80.5021 118C80.7698 85.7644 106.913 56.4618 149.347 35.1547C191.972 13.7522 250.891 0.5 316 0.5C381.109 0.5 440.028 13.7522 482.653 35.1547C525.087 56.4618 551.23 85.7644 551.498 118H80.5021Z"
                  stroke="black"
                />
              </g>
            </svg>

            {GRADIENT_IMAGES.map((src, index) => {
              return (
                <DockItem
                  key={index}
                  index={index}
                  onClick={() => {
                    setIndex(index);
                  }}
                >
                  <div>{index}</div>
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
