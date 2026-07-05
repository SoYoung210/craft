'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

import { Navbar } from '../../components/content/navbar/Navbar';
import PageLayout from '../../components/layout/page-layout/PageLayout';

const newsItems = [
  {
    date: 'Sat, 04 Jul 2026',
    title: "Max to start British GP from P7: 'It just didn't work'",
  },
  {
    date: 'Fri, 03 Jul 2026',
    title: "Max sixth in Silverstone sprint: 'We're just too slow'",
  },
  {
    date: 'Sun, 28 Jun 2026',
    title: 'Max voted Driver of the Day at the Red Bull Ring',
  },
  {
    date: 'Sun, 28 Jun 2026',
    title: "Excellent second place for Max in Austria: 'Extremely positive'",
  },
];

const careerStats = [
  { label: 'World championships', value: 4 },
  { label: 'Grand Prix wins', value: 71 },
  { label: 'Podiums', value: 128 },
  { label: 'Pole positions', value: 48 },
  { label: 'Fastest laps', value: 37 },
  { label: 'Race starts', value: 240 },
];

function StatValue({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const count = useMotionValue(0);
  const spring = useSpring(count, { stiffness: 80, damping: 30 });
  const display = useTransform(spring, v => Math.round(v).toString());

  useEffect(() => {
    if (inView) {
      count.set(value);
    }
  }, [inView, count, value]);

  return (
    <span ref={ref} className="text-5xl font-semibold text-gray-8">
      <motion.span>{display}</motion.span>
    </span>
  );
}

export default function NavbarClient() {
  return (
    <>
      <Navbar />
      <PageLayout className="max-w-[1080px] pt-28 md:pt-32 lg:pt-36">
        <PageLayout.Title>Navbar</PageLayout.Title>
        <PageLayout.SubTitle>
          Scroll down to see the bar shrink and the wordmark collapse.
        </PageLayout.SubTitle>

        <section id="news" className="flex scroll-mt-24 flex-col gap-2 pt-12">
          <h2 className="text-[20px] font-medium text-gray-8 tracking-[-0.01em]">
            News
          </h2>
          <ul className="flex flex-col divide-y divide-gray-2">
            {newsItems.map(item => (
              <li key={item.title} className="group flex flex-col gap-1 py-5">
                <span className="text-[13px] text-gray-5">{item.date}</span>
                <span className="text-[17px] font-medium text-gray-6 transition-colors group-hover:text-gray-8">
                  {item.title}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section
          id="career"
          className="flex scroll-mt-24 flex-col gap-10 pt-12 pb-24"
        >
          <h2 className="text-[20px] font-medium text-gray-8 tracking-[-0.01em]">
            Career
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3">
            {careerStats.map(stat => (
              <div key={stat.label} className="flex flex-col gap-2">
                <StatValue value={stat.value} />
                <span className="text-[14px] text-gray-5">{stat.label}</span>
              </div>
            ))}
          </div>
          <p className="max-w-[560px] text-[15px] leading-[1.7] text-gray-6">
            Max Emilian Verstappen, born 30 September 1997, became the youngest
            driver in Formula 1 history at 17 years and 166 days — and went on
            to win four consecutive world championships from 2021 to 2024.
          </p>
        </section>
      </PageLayout>
    </>
  );
}
