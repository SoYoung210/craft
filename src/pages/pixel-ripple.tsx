import { Leva, useControls } from 'leva';

import {
  PixelRipple,
  PixelRippleCanvas,
} from '../components/content/pixel-ripple';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function PixelRipplePage() {
  const { useCanvas, ...params } = useControls('Pixel Ripple Controls', {
    useCanvas: {
      value: true,
      label: 'Canvas',
    },
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
            controlWidth: '120px',
          },
          space: {
            sm: '6px',
          },
        }}
      />
      <PageLayout>
        <PageLayout.Title>Pixel Ripple</PageLayout.Title>
        <PageLayout.Details>
          <PageLayout.Summary>
            Pixel Ripple Effect (DOM vs Canvas)
          </PageLayout.Summary>
          <PageLayout.DetailsContent>
            <div className="space-y-6 text-gray-700">
              <section>
                <h3 className="text-gray-900 font-semibold mb-3">
                  How the Ripple Effect Works
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-gray-800 text-sm font-medium mb-2">
                      Distance-Based Animation
                    </h4>
                    <p className="text-sm leading-relaxed mb-2 text-gray-600">
                      Like ripples in a pond, pixels spread outward from the
                      mouse entry point:
                    </p>
                    <pre className="text-xs bg-gray-50 border border-gray-200 p-3 rounded font-mono overflow-x-auto text-gray-700">
                      {`     Mouse enters here
            ↓
         [ • ]      ← Center (Band 0)
       [     ]      ← Band 1
     [       ]      ← Band 2
   [         ]      ← Band 3
 [           ]      ← Band 4
[             ]     ← Band 5 (Edge)`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-gray-800 text-sm font-medium mb-2">
                      The Wave Motion
                    </h4>
                    <p className="text-sm leading-relaxed mb-2 text-gray-600">
                      A moving wave travels from center to edges, showing only 2
                      bands at a time:
                    </p>
                    <pre className="text-xs bg-gray-50 border border-gray-200 p-3 rounded font-mono overflow-x-auto text-gray-700">
                      {`Time →  0%        25%       50%       75%       100%

        ██                                        Band 0-1
                  ██                              Band 2-3
                            ██                    Band 4-5
                                      ██          Band 6-7
                                                ██ Edge`}
                    </pre>
                  </div>

                  <div>
                    <h4 className="text-gray-800 text-sm font-medium mb-2">
                      Adding Randomness
                    </h4>
                    <p className="text-sm leading-relaxed mb-2 text-gray-600">
                      To avoid obvious circular bands, added randomness:
                    </p>
                    <pre className="text-xs bg-gray-50 border border-gray-200 p-3 rounded font-mono overflow-x-auto text-gray-700">
                      {`Perfect Circle:          With Randomness:
   ●●●●●●●                  ●  ●●●
  ●●●●●●●●●                ●●  ● ●●●
 ●●●●●●●●●●●              ● ●●●   ●●●
●●●●●●●●●●●●●            ●● ● ●●● ● ●
 ●●●●●●●●●●●              ●●  ●● ●●●
  ●●●●●●●●●                 ● ●●● ●
   ●●●●●●●                   ●● ●●`}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-gray-800 text-sm font-medium mb-2">
                        Key Parameters
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li className="flex gap-2">
                          <span className="text-gray-700 font-medium">
                            Grid Size:
                          </span>
                          <span className="text-gray-500">
                            Pixel count across
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-gray-700 font-medium">
                            Wave Width:
                          </span>
                          <span className="text-gray-500">2 bands visible</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-gray-700 font-medium">
                            Duration:
                          </span>
                          <span className="text-gray-500">Animation speed</span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-gray-700 font-medium">
                            Density:
                          </span>
                          <span className="text-gray-500">
                            Coverage percentage
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-gray-800 text-sm font-medium mb-2">
                        Animation Timeline
                      </h4>
                      <ol className="text-sm space-y-1 text-gray-500">
                        <li>1. Calculate distances</li>
                        <li>2. Group into 8 bands</li>
                        <li>3. Wave starts at center</li>
                        <li>4. Moves through bands</li>
                        <li>5. Pixels fade in/out</li>
                        <li>6. Reaches edge & vanishes</li>
                      </ol>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-500 italic">
                      Each pixel has random timing offset and 60% appearance
                      chance, creating an organic digital dissolution effect.
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </PageLayout.DetailsContent>
        </PageLayout.Details>

        <div className="space-y-8">
          <div>
            <div className="flex items-start gap-4 mb-4">
              <h3 className="text-gray-900 flex-1">
                {useCanvas ? 'Canvas Version' : 'DOM Version'}
              </h3>
            </div>
            {useCanvas ? (
              <PixelRippleCanvas
                pixelColor={params.pixelColor}
                gridSize={params.gridSize}
                animationDuration={params.animationDuration}
                density={params.density}
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
            ) : (
              <PixelRipple
                pixelColor={params.pixelColor}
                gridSize={params.gridSize}
                animationStepDuration={params.animationDuration / 1000}
                density={params.density}
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
            )}
          </div>
        </div>
      </PageLayout>
    </>
  );
}
