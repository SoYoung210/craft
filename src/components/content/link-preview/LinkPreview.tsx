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
          <a href={url} target="_blank" rel="noreferrer">
            {label}
          </a>
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

export default LinkPreview;
