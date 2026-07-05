import img1371 from '../../../images/view/IMG_1371.webp';
import img4147 from '../../../images/view/IMG_4147.webp';
import img4192 from '../../../images/view/IMG_4192.webp';
import img8117 from '../../../images/view/IMG_8117.webp';
import fxn1 from '../../../images/view/fxn1.webp';
import fxn2 from '../../../images/view/fxn2.webp';
import fxn3 from '../../../images/view/fxn3.webp';

export interface MediaItem {
  id: string;
  url: string;
  ratio: number;
}

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'shader-1',
    url: '/images/shader-image/test1.jpeg',
    ratio: 2268 / 4032,
  },
  { id: 'view-1371', url: img1371.src, ratio: img1371.width / img1371.height },
  { id: 'fxn-1', url: fxn1.src, ratio: fxn1.width / fxn1.height },
  { id: 'james', url: '/images/image-tips/james_web.jpg', ratio: 3600 / 2085 },
  { id: 'view-4192', url: img4192.src, ratio: img4192.width / img4192.height },
  { id: 'ripple', url: '/thumbnails/ripple_clean.webp', ratio: 4032 / 3024 },
  { id: 'view-8117', url: img8117.src, ratio: img8117.width / img8117.height },
  { id: 'view-4147', url: img4147.src, ratio: img4147.width / img4147.height },
  { id: 'fxn-2', url: fxn2.src, ratio: fxn2.width / fxn2.height },
  { id: 'fxn-3', url: fxn3.src, ratio: fxn3.width / fxn3.height },
];
