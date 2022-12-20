import { useCallback, useState } from 'react';
import anime from 'animejs';

import Text from '../components/material/Text';
import { styled } from '../../stitches.config';
import PageLayout from '../components/layout/PageLayout';
import { VStack } from '../components/material/Stack';
import Button from '../components/material/Button';

const GENIE_EFFECT_SHAPE = {
  // basic square shape
  STEP0:
    'M251.745 0.5H496.605C499.45 0.5 501.103 2.65 500.295 5.3C500.295 5.3 500.295 229.5 500.295 370.5C406.47 370.5 339.306 370.5 339.306 370.5C343.783 370.5 333.637 370.5 330.79 370.5H172.696C169.849 370.5 133.833 370.5 129.356 370.5C129.356 370.5 85.077 370.5 0.5 370.5C0.499954 290.508 3.19297 5.3 3.19297 5.3C2.38522 2.65 4.03889 0.5 6.88409 0.5H251.745Z',
  STEP1:
    'M250 0H496.086C498.945 0 500.606 2.15 499.794 4.8C499.794 4.8 475.603 91.046 403.538 179.622C331.471 268.197 334.636 364.992 334.636 364.992C334.601 367.768 332.303 370 329.441 370H170.556C167.695 370 165.396 367.768 165.362 364.992C165.362 364.992 168.524 268.197 96.4601 179.622C24.3959 91.046 0.205832 4.8 0.205832 4.8C-0.605964 2.15 1.05599 0 3.91542 0H250Z',
};

const MATRIX_TRANSFORM = {
  IDENTITY: '1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1',
  SKEW: '0.2, 0, 0, 0,  0, 0.3, 0, 0.001,  0, 0, 1, 0,  0, 0, 0, 1.1',
};
export default function GenieWindow() {
  const [pathElement, setPathElement] = useState<SVGPathElement | null>(null);
  const [modalElement, setModalElement] = useState<HTMLDivElement | null>(null);
  const [buttonElement, setButtonElement] = useState<HTMLButtonElement | null>(
    null
  );

  const handleClose = useCallback(() => {
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
        targets: modalElement,
        translateY: -15,
        duration: 300,
      })
      .add({
        targets: pathElement,
        d: [
          {
            value: GENIE_EFFECT_SHAPE.STEP1,
          },
        ],
        duration: 450,
      })
      .add({
        targets: modalElement,
        matrix3d: MATRIX_TRANSFORM.SKEW,
        opacity: 0,
        duration: 400,
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
        <PageLayout.Summary>TBD</PageLayout.Summary>
        <PageLayout.DetailsContent>TBD</PageLayout.DetailsContent>
      </PageLayout.Details>

      <Modal ref={setModalElement}>
        <ModalBorder data-role="modal-border" />
        <ModalContent>
          <VStack gap={32}>
            <Text color="#434343" size={20}>
              Modal Interaction with Genie Effect
            </Text>
            <Text color="#7E7878" css={{ textAlign: 'center' }}>
              Inspired by Mac OS X minimize interaction.
            </Text>
          </VStack>
          <button onClick={handleClose}>minimize</button>
        </ModalContent>
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
                // step 0
                d="M251.745 0.5H496.605C499.45 0.5 501.103 2.65 500.295 5.3C500.295 5.3 500.295 229.5 500.295 370.5C406.47 370.5 339.306 370.5 339.306 370.5C343.783 370.5 333.637 370.5 330.79 370.5H172.696C169.849 370.5 133.833 370.5 129.356 370.5C129.356 370.5 85.077 370.5 0.5 370.5C0.499954 290.508 3.19297 5.3 3.19297 5.3C2.38522 2.65 4.03889 0.5 6.88409 0.5H251.745Z"
                // step 1
                // d="M250 0H496.086C498.945 0 500.606 2.15 499.794 4.8C499.794 4.8 475.603 91.046 403.538 179.622C331.471 268.197 334.636 364.992 334.636 364.992C334.601 367.768 332.303 370 329.441 370H170.556C167.695 370 165.396 367.768 165.362 364.992C165.362 364.992 168.524 268.197 96.4601 179.622C24.3959 91.046 0.205832 4.8 0.205832 4.8C-0.605964 2.15 1.05599 0 3.91542 0H250Z"
                // step 2
                // d="M251.745 0.5H496.605C499.45 0.5 501.103 2.65 500.295 5.3C500.295 5.3 500.295 229.5 500.295 370.5C406.47 370.5 339.306 370.5 339.306 370.5C343.783 370.5 333.637 370.5 330.79 370.5H172.696C169.849 370.5 133.833 370.5 129.356 370.5C129.356 370.5 85.077 370.5 0.5 370.5C0.499954 290.508 3.19297 5.3 3.19297 5.3C2.38522 2.65 4.03889 0.5 6.88409 0.5H251.745Z"
              />
            </clipPath>
          </defs>
        </svg>
      </Modal>

      <Button
        ref={setButtonElement}
        style={{ width: 120, marginLeft: 200, opacity: 0 }}
        onClick={handleOpen}
      >
        Open Modal
      </Button>
    </PageLayout>
  );
}
// 110368588840
const ModalBorder = styled('div', {
  position: 'absolute',
  top: 0,
  left: 1,
  width: 'calc(100% + 2px)',
  height: 'calc(100% + 2px)',
  clipPath: 'url(#clipping)',
  borderRadius: 'inherit',

  transition: 'clip-path 1s',
  backgroundColor: '$gray3',
  zIndex: -1,
});

const Modal = styled('div', {
  position: 'relative',

  width: 500,
  height: 300,
  borderRadius: 8,
  // for border visible
  paddingTop: '1px',
  // svg path때문에 튜닝 (사실 svg path가 직사각형이어야...)
  paddingRight: 1,
  paddingLeft: 4,

  transformOrigin: 'bottom',
});

const ModalContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',

  backgroundColor: '$white',
  borderRadius: 'inherit',

  width: 'calc(100% + 8px)',
  height: 'calc(100% + 3px)',
  transform: 'scale(0.996)',
  transformOrigin: '-100% -33%',

  clipPath: 'url(#clipping)',
  transition: 'clip-path 1s',
});
