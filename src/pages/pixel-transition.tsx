import { Leva, useControls } from 'leva';

import {
  PixelTransition,
  PixelTransitionCanvas,
} from '../components/content/pixel-transition';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function PixelTransitionPage() {
  const canvasParams = useControls('Canvas Controls', {
    pixelColor: {
      value: '#ffffff',
      label: 'Pixel Color',
    },
    gridSize: {
      value: 30,
      min: 10,
      max: 100,
      step: 1,
      label: 'Grid Size',
    },
    animationDuration: {
      value: 600,
      min: 100,
      max: 2000,
      step: 50,
      label: 'Duration (ms)',
    },
    density: {
      value: 100,
      min: 10,
      max: 100,
      step: 1,
      label: 'Density (%)',
    },
  });

  return (
    <>
      {/* Leva control panel positioned at top-right */}
      <Leva
        titleBar={{
          drag: true,
        }}
        collapsed={false}
        hidden={false}
        theme={{
          sizes: {
            rootWidth: '280px',
            controlWidth: '160px',
          },
          space: {
            sm: '6px',
          },
        }}
      />
      <PageLayout>
        <PageLayout.Title>Pixel Transition</PageLayout.Title>
        <PageLayout.Details>
          <PageLayout.Summary>
            Pixel Transition (DOM vs Canvas Comparison)
          </PageLayout.Summary>
        </PageLayout.Details>

        <div className="space-y-8">
          <div>
            <div className="flex items-start gap-4 mb-4">
              <h3 className="text-white flex-1">
                Canvas Version (Better Performance)
              </h3>
            </div>
            <PixelTransitionCanvas
              pixelColor={canvasParams.pixelColor}
              gridSize={canvasParams.gridSize}
              animationDuration={canvasParams.animationDuration}
              density={canvasParams.density}
              className="w-full lg:w-auto"
              firstContent={
                <a
                  href="https://form.typeform.com/to/knSo3TYw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative bg-[#0066FF] text-white font-acronym text-[32px] px-8 md:px-24 lg:px-32 py-5 md:py-10 lg:py-12 flex items-center justify-center gap-3 md:gap-6 transition-all duration-300 uppercase tracking-wide whitespace-nowrap w-full"
                >
                  <span>Register Now (Canvas)</span>
                </a>
              }
              secondContent={null}
            />
          </div>

          <div>
            <h3 className="text-white mb-4">DOM Version (Original)</h3>
            <PixelTransition
              pixelColor="#fff"
              gridSize={30}
              animationStepDuration={0.6}
              density={80}
              className="w-full lg:w-auto"
              firstContent={
                <a
                  href="https://form.typeform.com/to/knSo3TYw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative bg-[#6C16B8] text-white font-acronym text-[32px] px-8 md:px-24 lg:px-32 py-5 md:py-10 lg:py-12 flex items-center justify-center gap-3 md:gap-6 transition-all duration-300 uppercase tracking-wide whitespace-nowrap w-full"
                >
                  <span>Register Now (DOM)</span>
                </a>
              }
              secondContent={null}
            />
          </div>
        </div>
      </PageLayout>
    </>
  );
}
