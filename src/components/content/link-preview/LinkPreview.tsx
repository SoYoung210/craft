import { useState } from 'react';

import { styled } from '../../../../stitches.config';
import errorView from '../../../images/link-preview/error_view.png';

import { useLinkPreview } from './hooks/useLinkPreview';
import { LoadingSkeleton, Tooltip } from './styled';
interface Props {
  label: string;
  url: string;
  preview?: string;
}

const LinkPreview = ({ label, preview, url }: Props) => {
  const [imgLoading, setImgLoading] = useState(true);
  const [linkPreview, setLinkPreview] = useLinkPreview(url, {
    initialData: preview,
    onError: () => setLinkPreview(errorView),
  });

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
            align="center"
          >
            {imgLoading && <LoadingSkeleton />}
            <Tooltip.Image
              src={linkPreview}
              onLoad={() => setImgLoading(false)}
              width={200}
              height={120}
              style={{ display: imgLoading ? 'none' : 'block' }}
              alt={`${label} site preview`}
            />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const Link = styled('a', {
  position: 'relative',
  display: 'inline-block',
  color: '$black',

  '&:visited': {
    color: '$black',
  },

  '&::after': {
    content: '""',
    width: '100%',
    height: 2,
    backgroundColor: '$gray10',
    position: 'absolute',
    bottom: -2,
    left: '50%',
    transition: 'transform 0.2s ease',
    transformOrigin: 'center',
    transform: 'translateX(-50%) scaleX(0)',
  },

  '&:focus, &:hover': {
    '&::after': {
      transform: 'translateX(-50%) scaleX(1)',
    },
  },
});
export default LinkPreview;
