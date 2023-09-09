import { useState } from 'react';

import { styled } from '../../stitches.config';
import PageLayout from '../components/layout/page-layout/PageLayout';

const COLORS = [
  '#D56767',
  '#42DEF3',
  '#D8D364',
  '#59A46A',
  '#486191',
  '#724A9A',
];
export default function LinearIconPickerTransition() {
  const [color, setColor] = useState(COLORS[0]);
  return (
    <PageLayout>
      <PageLayout.Title>LinearIconPickerTransition</PageLayout.Title>
      <PageLayout.Details>
        <PageLayout.Summary>LinearIconPickerTransition</PageLayout.Summary>
        <PageLayout.DetailsContent></PageLayout.DetailsContent>
      </PageLayout.Details>
      {COLORS.map(color => {
        return (
          <button
            key={color}
            onClick={() => {
              setColor(color);
            }}
            style={{ backgroundColor: color }}
          >
            change color
          </button>
        );
      })}
      <IconGrid>
        {new Array(126).fill(null).map((_, index) => {
          const rowIndex = Math.floor(index / 14);
          const colIndex = index % 14;

          const transitionDelay = 20 * rowIndex + colIndex * 5;

          return (
            <IconRoot
              key={index}
              style={{
                // @ts-ignore
                '--icon-color': color,
                '--icon-transition-delay': `${transitionDelay}ms`,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="#00000070">
                <path d="M3.9558 14.653C3.89329 14.8106 3.98768 14.9868 4.15572 15.0093C6.37462 15.3065 9.37946 14.0947 12.1025 11.3717C15.545 7.92916 14.9998 0.999944 14.9998 0.999944C14.9998 0.999944 8.07474 0.458867 4.63217 3.90144C1.9578 6.57581 0.741126 9.52205 0.980109 11.7286C1.00031 11.9151 1.22561 11.9811 1.35471 11.8449C3.75627 9.31167 6.67803 7.32865 9.91905 6.03225L9.99982 5.99994C7.371 8.30015 5.32803 11.1936 4.04009 14.4405L3.9558 14.653Z"></path>
              </svg>
            </IconRoot>
          );
        })}
      </IconGrid>
    </PageLayout>
  );
}

const IconGrid = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(14, 28px)',
  gridTemplateRows: 'repeat(9, 28px)',
});

const IconRoot = styled('div', {
  padding: 6,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 28,
  aspectRatio: '1 / 1',

  '& svg': {
    flexShrink: 0,
  },
  '& path': {
    transitionProperty: 'fill',
    transitionDuration: '0.4s',
    fill: 'var(--icon-color)',
    transitionDelay: 'var(--icon-transition-delay)',
  },
});
