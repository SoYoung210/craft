import { Fragment, useState } from 'react';

import { styled } from '../../stitches.config';
import PageLayout from '../components/layout/page-layout/PageLayout';
import CheckIcon from '../images/icons/check.svg';

const COLORS = [
  '#78716c',
  '#0ea5e9',
  '#f59e0b',
  '#22c55e',
  '#f43f5e',
  '#a855f7',
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
      {/* {COLORS.map(color => {
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
      })} */}
      <Root>
        <ColorPaletteRoot>
          <ColorPaletteInner>
            {COLORS.map(color => {
              return (
                <ColorButton
                  key={color}
                  style={{
                    backgroundColor: color,
                  }}
                  onClick={() => {
                    setColor(color);
                  }}
                />
              );
            })}
          </ColorPaletteInner>
        </ColorPaletteRoot>
        <IconGrid>
          {new Array(10).fill(null).map((_, rowIndex) => {
            return (
              <Fragment key={rowIndex}>
                {new Array(10).fill(null).map((_, colIndex) => {
                  const transitionDelay = 20 * rowIndex + colIndex * 5;
                  return (
                    <IconRoot
                      key={rowIndex * 14 + colIndex}
                      style={{
                        // @ts-ignore
                        '--icon-color': color,
                        '--icon-transition-delay': `${transitionDelay}ms`,
                      }}
                    >
                      <CheckIcon />
                    </IconRoot>
                  );
                })}
              </Fragment>
            );
          })}
        </IconGrid>
      </Root>
    </PageLayout>
  );
}

const IconGrid = styled('div', {
  display: 'grid',
  // gridTemplateColumns: 'repeat(14, 28px)',
  // gridTemplateRows: 'repeat(9, 28px)',
  gridTemplateColumns: 'repeat(10, 1fr)',
  gridTemplateRows: 'repeat(10, 1fr)',
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
    minWidth: 22,
  },
  '& path, & circle': {
    transitionProperty: 'stroke',
    transitionDuration: '0.4s',
    stroke: 'var(--icon-color)',
    transitionDelay: 'var(--icon-transition-delay)',
  },
});

const Root = styled('div', {
  borderRadius: 6,
  // width: 412,
  boxShadow:
    'rgba(0, 0, 0, 0.086) 0 3px 12px, inset 0 0 0 0.5px rgba(216, 216, 216, 0.8)',
  backdropFilter: 'blur(25px) saturate(190%) contrast(50%) brightness(130%)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  padding: '8px 10px',
  display: 'flex',
  flexDirection: 'column',
});

const ColorPaletteRoot = styled('div', {
  position: 'relative',
  height: 32,
});

const ColorPaletteInner = styled('div', {
  position: 'absolute',
  top: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingRight: 48,
  paddingLeft: 4,
  width: '100%',
  height: '100%',
});

const ColorButton = styled('button', {
  resetButton: 'flex',
  borderRadius: '50%',
  size: 28,
});
