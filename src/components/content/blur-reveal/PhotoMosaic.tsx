import { MEDIA_ITEMS } from '@/components/content/media-preview/data';

const TILES = [...MEDIA_ITEMS, ...MEDIA_ITEMS].map((item, index) => ({
  ...item,
  key: `${item.id}-${index}`,
}));

export default function PhotoMosaic() {
  return (
    <div
      aria-hidden
      className="columns-2 gap-2 p-2 sm:columns-3 lg:columns-4 xl:columns-5"
    >
      {TILES.map(tile => (
        <div
          key={tile.key}
          className="mb-2 break-inside-avoid overflow-hidden rounded-xl bg-black/5"
          style={{ aspectRatio: tile.ratio }}
        >
          <img
            src={tile.url}
            alt=""
            draggable={false}
            className="size-full select-none object-cover"
          />
        </div>
      ))}
    </div>
  );
}
