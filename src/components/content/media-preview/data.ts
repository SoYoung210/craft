import img1371 from '../../../images/media-preview/IMG_1371.webp';
import img4147 from '../../../images/media-preview/IMG_4147.webp';
import img4192 from '../../../images/media-preview/IMG_4192.webp';
import img8117 from '../../../images/media-preview/IMG_8117.webp';
import fxn1 from '../../../images/media-preview/fxn1.webp';
import fxn2 from '../../../images/media-preview/fxn2.webp';
import fxn3 from '../../../images/media-preview/fxn3.webp';
import james from '../../../images/media-preview/james_web.webp';
import ripple from '../../../images/media-preview/ripple_clean.webp';
import test1 from '../../../images/media-preview/test1.webp';

export interface MediaItem {
  id: string;
  url: string;
  ratio: number;
}

export const MEDIA_ITEMS: MediaItem[] = [
  { id: 'shader-1', url: test1.src, ratio: test1.width / test1.height },
  { id: 'view-1371', url: img1371.src, ratio: img1371.width / img1371.height },
  { id: 'fxn-1', url: fxn1.src, ratio: fxn1.width / fxn1.height },
  { id: 'james', url: james.src, ratio: james.width / james.height },
  { id: 'view-4192', url: img4192.src, ratio: img4192.width / img4192.height },
  { id: 'ripple', url: ripple.src, ratio: ripple.width / ripple.height },
  { id: 'view-8117', url: img8117.src, ratio: img8117.width / img8117.height },
  { id: 'view-4147', url: img4147.src, ratio: img4147.width / img4147.height },
  { id: 'fxn-2', url: fxn2.src, ratio: fxn2.width / fxn2.height },
  { id: 'fxn-3', url: fxn3.src, ratio: fxn3.width / fxn3.height },
];
