import { styled } from '../../../../stitches.config';

import { LoadingSkeleton, Tooltip } from './styled';

interface Props {
  label: string;
  url: string;
  preview?: string;
}

const LinkPreview = ({ label, preview, url }: Props) => {
  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={100}>
        <Tooltip.Trigger asChild>
          <Link href={url} target="_blank" rel="noreferrer">
            {label}
          </Link>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="TooltipContent"
            sideOffset={12}
            side="top"
            align="start"
          >
            {preview === undefined ? (
              <LoadingSkeleton />
            ) : (
              <Tooltip.Image
                src={preview}
                width={200}
                height={120}
                alt={`${label} site preview`}
              />
            )}
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const Link = styled('a', {
  position: 'relative',
  display: 'inline-block',

  '&::after': {
    content: '""',
    width: 0,
    height: 2,
    backgroundColor: '$gray10',
    position: 'absolute',
    bottom: -2,
    left: 0,
    transition: 'width 0.2s ease',
  },

  '&:focus, &:hover': {
    '&::after': {
      width: '100%',
    },
  },
});
export default LinkPreview;
