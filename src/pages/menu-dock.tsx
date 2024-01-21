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
          height: 390,
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
            {/* <svg
              width="632"
              height="107"
              viewBox="0 0 632 107"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g>
                <path
                  d="M551.324 63.5H80.7498C84.2242 55.4602 92.0566 47.5628 103.88 40.2182C116.03 32.6706 132.344 25.7388 152.327 19.8516C192.29 8.07769 246.865 0.5 312 0.5C377.141 0.5 434.345 7.10308 476.623 18.3913C497.764 24.0358 515.152 30.8464 527.93 38.5746C540.422 46.1299 548.443 54.5226 551.324 63.5Z"
                  stroke="black"
                />
              </g>
            </svg> */}

            {GRADIENT_IMAGES.map((src, index) => {
              return (
                <DockItem
                  key={index}
                  index={index}
                  onClick={() => {
                    setIndex(index);
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
