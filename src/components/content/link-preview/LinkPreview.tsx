import { useState } from 'react';

import { cn } from '../../../utils/cn';
const errorView = '/images/link-preview/error_view.png';

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
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={cn(
              'relative inline-block text-black visited:text-black',
              'after:content-[""] after:w-full after:h-0.5 after:bg-gray-10 after:absolute after:-bottom-0.5 after:left-1/2',
              'after:origin-center after:transition-[transform] after:duration-200 after:ease-[ease]',
              'after:[transform:translateX(-50%)_scaleX(0)]',
              'hover:after:[transform:translateX(-50%)_scaleX(1)]',
              'focus:after:[transform:translateX(-50%)_scaleX(1)]'
            )}
          >
            {label}
          </a>
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

export default LinkPreview;
