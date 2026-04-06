import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { ITEMS } from '../src/app/_data/items';

const OUTPUT_PATH = resolve(__dirname, '../src/app/_data/video-posters.ts');

function extractPoster(videoUrl: string): string {
  const buf = execSync(
    `ffmpeg -i "${videoUrl}" -vframes 1 -vf "scale=32:-1" -f image2pipe -vcodec png - 2>/dev/null`
  );
  return buf.toString('base64');
}

const videoItems = ITEMS.filter(item => item.videoSrc);

const entries = videoItems.map(item => {
  console.log(`Generating poster for: ${item.title}`);
  const base64 = extractPoster(item.videoSrc!);
  return `  '${item.videoSrc}':\n    '${base64}',`;
});

const output = `export const VIDEO_POSTERS: Record<string, string> = {\n${entries.join('\n')}\n};\n`;

writeFileSync(OUTPUT_PATH, output);
console.log(`Wrote ${videoItems.length} posters to ${OUTPUT_PATH}`);
