import { styled } from '../../stitches.config';
import { Command } from '../components/cmdk/CmdK';
import PageLayout from '../components/layout/page-layout/PageLayout';
import Portal from '../components/utility/Portal';
import useConfetti from '../hooks/confetti/useConfetti';

export default function CofettiPage() {
  const [setCanvasElement, fire] = useConfetti();
  const [setCustomCanvasElement, fireCustom] = useConfetti();

  return (
    <PageLayout>
      <PageLayout.Title>Confetti Examples</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>canvas-confetti + React</PageLayout.Summary>
        <PageLayout.DetailsContent>
          useConfetti hook / Portal / Canvas
        </PageLayout.DetailsContent>
      </PageLayout.Details>

      <Command>
        <Command.Input placeholder="검색..." />
        <Command.Divider />
        <Command.List>
          <Command.Item
            onSelect={() => {
              fire({
                particleCount: 700,
                angle: 60,
                spread: 200,
                startVelocity: 180,
                colors: [
                  '#73DBA9',
                  '#AE92FE',
                  '#FECC4F',
                  '#FE7A7B',
                  '#D64EA8',
                  '#6BCAFD',
                ],
                scalar: 2,
                drift: 1.6,
                origin: { x: 0, y: 1.5 },
              });

              fire({
                particleCount: 700,
                angle: 120,
                spread: 200,
                drift: -1.6,
                startVelocity: 180,
                scalar: 2,
                colors: [
                  '#73DBA9',
                  '#AE92FE',
                  '#FECC4F',
                  '#FE7A7B',
                  '#D64EA8',
                  '#6BCAFD',
                ],

                origin: { x: 1, y: 1.5 },
              });
            }}
          >
            🎊 Left/Right Side
          </Command.Item>

          <Command.Item
            onSelect={() => {
              fire({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            }}
          >
            🎉 Center
          </Command.Item>

          <Command.Item
            onSelect={() => {
              fire({
                spread: 360,
                ticks: 50,
                gravity: 0,
                decay: 0.94,
                startVelocity: 30,
                shapes: ['star'] as any,
                colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
              });
            }}
          >
            🌟 Star
          </Command.Item>
        </Command.List>
      </Command>

      <Portal>
        <Canvas style={{ position: 'fixed' }} ref={setCanvasElement} />
      </Portal>

      <H2>Custom Canvas</H2>

      <Portal>
        <Portal.Container asChild>
          <CustomContainer />
        </Portal.Container>
        <Portal.Root>
          <Canvas ref={setCustomCanvasElement} />
          <RunButton
            onClick={() => {
              fireCustom({
                spread: 70,
                origin: { y: 0.8 },
              });
            }}
          >
            Run
          </RunButton>
        </Portal.Root>
      </Portal>
    </PageLayout>
  );
}

const CustomContainer = styled('div', {
  background: 'rgba(0,0,0,.027)',
  br: 12,
  padding: 16,
  boxShadow: '0 5px 30px -5px rgb(0 0 0 / 10%)',
  border: '1px solid #e2e2e2',

  height: 640,
});

const Canvas = styled('canvas', {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 1,
  width: '100%',
  height: '100%',
  pointerEvents: 'none',
});

const H2 = styled('h2', {
  color: '$gray8',
});
const RunButton = styled('button', {
  cursor: 'pointer',
  background: 'rgba(0,0,0,.047)',
  br: 8,
  height: 32,
  px: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  fontWeight: 600,
  color: '$gray7',

  transitionProperty: 'color, background',
  transitionTimingFunction: 'ease',
  transitionDuration: '0.15s',

  '&:hover': {
    color: '$gray10',
    background: 'rgba(0,0,0,.071)',
  },
});
