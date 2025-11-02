import { PixelTransition } from '../components/content/pixel-transition/pixel-transition';
import PageLayout from '../components/layout/page-layout/PageLayout';

export default function PixelTransitionPage() {
  return (
    <PageLayout>
      <PageLayout.Title>Pixel Transition</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>Pixel Transition</PageLayout.Summary>
      </PageLayout.Details>
      <PixelTransition
        pixelColor="#fff"
        gridSize={30}
        animationStepDuration={0.8}
        density={80}
        className="w-full lg:w-auto"
        firstContent={
          <a
            href="https://form.typeform.com/to/knSo3TYw"
            target="_blank"
            rel="noopener noreferrer"
            className="relative bg-[#6C16B8] text-white font-acronym text-[24px] md:text-[48px] lg:text-[64px] px-8 md:px-24 lg:px-32 py-5 md:py-10 lg:py-12 flex items-center justify-center gap-3 md:gap-6 transition-all duration-300 uppercase tracking-wide whitespace-nowrap w-full"
          >
            <span>Register Now</span>
            <svg
              className="w-8 h-8 md:w-14 md:h-14 lg:w-16 lg:h-16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M8 12H16M16 12L12 8M16 12L12 16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        }
        secondContent={null}
      />
    </PageLayout>
  );
}
