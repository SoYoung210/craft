'use client';

import { useCallback, useState } from 'react';
import anime from 'animejs';

import Text from '../../components/material/Text';
import PageLayout from '../../components/layout/page-layout/PageLayout';
import { HStack, VStack } from '../../components/material/Stack';
import Button from '../../components/material/Button';

const GENIE_EFFECT_SHAPE = {
  STEP0:
    'M251.745 0.5H496.605C499.45 0.5 501.103 2.65 500.295 5.3C500.295 5.3 500.295 229.5 500.295 370.5C406.47 370.5 339.306 370.5 339.306 370.5C343.783 370.5 333.637 370.5 330.79 370.5H172.696C169.849 370.5 133.833 370.5 129.356 370.5C129.356 370.5 85.077 370.5 0.5 370.5C0.499954 290.508 3.19297 5.3 3.19297 5.3C2.38522 2.65 4.03889 0.5 6.88409 0.5H251.745Z',
  STEP1:
    'M250 0H496.086C498.945 0 500.606 2.15 499.794 4.8C499.794 4.8 475.603 91.046 403.538 179.622C331.471 268.197 334.636 364.992 334.636 364.992C334.601 367.768 332.303 370 329.441 370H170.556C167.695 370 165.396 367.768 165.362 364.992C165.362 364.992 168.524 268.197 96.4601 179.622C24.3959 91.046 0.205832 4.8 0.205832 4.8C-0.605964 2.15 1.05599 0 3.91542 0H250Z',
};

const MATRIX_TRANSFORM = {
  IDENTITY: '1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1',
  SKEW: '0.2, 0, 0, 0,  0, 0.3, 0, 0.001,  0, 0, 1, 0,  0, 0, 0, 1.1',
};
export default function GenieWindowClient() {
  const [pathElement, setPathElement] = useState<SVGPathElement | null>(null);
  const [modalElement, setModalElement] = useState<HTMLDivElement | null>(null);
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(
    null
  );

  const handleClose = useCallback(() => {
    console.log('close');
    anime
      .timeline({
        easing: 'easeOutCubic',
      })
      .add({
        targets: modalElement,
        matrix3d: MATRIX_TRANSFORM.IDENTITY,
        duration: 0,
      })
      .add({
        targets: pathElement,
        d: [
          {
            value: GENIE_EFFECT_SHAPE.STEP1,
          },
        ],
        duration: 350,
      })
      .add({
        targets: modalElement,
        matrix3d: MATRIX_TRANSFORM.SKEW,
        opacity: 0,
        duration: 600,
      })
      .add({
        targets: buttonElement,
        opacity: 1,
      });
  }, [buttonElement, modalElement, pathElement]);

  const handleOpen = useCallback(() => {
    anime
      .timeline({
        easing: 'easeOutCubic',
      })
      .add({
        targets: buttonElement,
        opacity: 0,
        duration: 300,
      })
      .add({
        targets: modalElement,
        matrix3d: MATRIX_TRANSFORM.SKEW,
        duration: 30,
      })
      .add({
        targets: modalElement,
        opacity: 1,
        duration: 200,
      })
      .add({
        targets: modalElement,
        matrix3d: MATRIX_TRANSFORM.IDENTITY,
        duration: 300,
      })
      .add({
        targets: pathElement,
        d: [
          {
            value: GENIE_EFFECT_SHAPE.STEP0,
          },
        ],
        duration: 450,
      });
  }, [buttonElement, modalElement, pathElement]);

  return (
    <PageLayout>
      <PageLayout.Title>Genie Window</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>
          clipPath + matrix3d transform (w.{' '}
          <a href="https://animejs.com/" target="_blank" rel="noreferrer">
            anime
          </a>
          )
        </PageLayout.Summary>
        <PageLayout.DetailsContent>
          <ol>
            <li>
              anime을 활용하여{' '}
              <a
                href="https://animejs.com/documentation/#morphing"
                target="_blank"
                rel="noreferrer"
              >
                svg morphing
              </a>{' '}
              (주의사항: svg morphing은 svg point개수가 같아야 하기 때문에,
              피그마에서 하나의 object로 morphing된 여러개의 svg를 제작 및 사용)
            </li>
            <li>
              하단 skew효과를 위해 matrix3d transform 적용 (참고:{' '}
              <a
                href="https://ramlmn.github.io/visualizing-matrix3d/"
                target="_blank"
                rel="noreferrer"
              >
                visualizing-matrix3d
              </a>
              )
            </li>
          </ol>
        </PageLayout.DetailsContent>
      </PageLayout.Details>

      <div
        ref={setModalElement}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          width: 500,
          height: 300,
          borderRadius: 8,
          paddingTop: 1,
          paddingRight: 1,
          paddingLeft: 4,
          transformOrigin: 'bottom',
        }}
      >
        <div
          data-role="modal-border"
          style={{
            position: 'absolute',
            top: 0,
            left: 1,
            width: 'calc(100% + 2px)',
            height: 'calc(100% - 1px)',
            clipPath: 'url(#clipping)',
            borderRadius: 'inherit',
            transition: 'clip-path 1s',
            backgroundColor: '#dee2e6',
            zIndex: -1,
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            backgroundColor: '#FFFFFF',
            borderRadius: 'inherit',
            width: 'calc(100% + 8px)',
            height: 'calc(100% + 3px)',
            transform: 'scale(0.996)',
            transformOrigin: '-100% -33%',
            clipPath: 'url(#clipping)',
            transition: 'clip-path 1s',
            position: 'relative',
          }}
        >
          <style>{`
            .dot-button {
              display: flex;
              position: absolute;
              top: 6%;
              left: 5%;
              background: transparent;
            }
            .dot-button .dot:nth-child(1) { background-color: #FF5F57; }
            .dot-button .dot:nth-child(2) { background-color: #FEBC2E; }
            .dot-button .dot:nth-child(3) { background-color: #28C840; }
          `}</style>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="dot-button"
          >
            <HStack gap={6}>
              <div className="dot" style={{ borderRadius: '50%', backgroundColor: '#dee2e6', width: 8, height: 8 }} />
              <div className="dot" style={{ borderRadius: '50%', backgroundColor: '#dee2e6', width: 8, height: 8 }} />
              <div className="dot" style={{ borderRadius: '50%', backgroundColor: '#dee2e6', width: 8, height: 8 }} />
            </HStack>
          </Button>
          <VStack gap={32}>
            <Text color="#434343" size={20}>
              Modal Interaction with Genie Effect
            </Text>
            <Text color="#7E7878" style={{ textAlign: 'center' }}>
              Inspired by Mac OS X minimize interaction.
            </Text>
          </VStack>
        </div>
      </div>
      <Button
        ref={setButtonElement}
        style={{ width: 120, marginLeft: 200, opacity: 0 }}
        onClick={handleOpen}
      >
        Open Modal
      </Button>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="502"
        height="302"
        viewBox="0 0 502 302"
      >
        <defs>
          <clipPath id="clipping">
            <path
              ref={setPathElement}
              fill="#FFF"
              stroke="#979797"
              d={GENIE_EFFECT_SHAPE.STEP0}
            />
          </clipPath>
        </defs>
      </svg>
    </PageLayout>
  );
}
