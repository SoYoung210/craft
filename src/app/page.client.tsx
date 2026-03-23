'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ContentBox } from '../components/layout/content-box/ContentBox';
import PageLayout from '../components/layout/page-layout/PageLayout';
import ContentList from '../components/layout/ContentList';

export default function IndexClient() {
  return (
    <PageLayout theme="gradient">
      <PageLayout.Title>Craft</PageLayout.Title>
      <ContentList>
        <ContentList.Item active>
          <Link href="/ripple-shader">
            <ContentBox
              title="Ripple Shader"
              style={{ backgroundColor: '#0a0a0a' }}
            >
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/ripple_og.webp"
                  alt="Ripple Shader preview"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/particles-loop">
            <ContentBox
              title="Particles Loop"
              style={{ backgroundColor: 'black' }}
            >
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/particles-loop.webp"
                  alt="Particles Loop"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/pixel-ripple">
            <ContentBox title="Pixel Ripple">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/pixel-ripple.png"
                  alt="Pixel Ripple"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/timezone-clock">
            <ContentBox title="Timezone Clock">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/clock-thumbanil-5.webp"
                  alt="Timezone Clock"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/dynamic-island-toc">
            <ContentBox title="Dynamic Island TOC">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/dynamic-island-toc.webp"
                  alt="Dynamic Island TOC"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/particle-effect">
            <ContentBox title="Particle Effect">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/particle-effect.webp"
                  alt="Particle Effect"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/radial-menu">
            <ContentBox title="Radial Menu">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/radial-menu.jpeg"
                  alt="Radial Menu with Content"
                  fill
                  quality={70}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/dock-menu">
            <ContentBox title="Dock Menu">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/dock-item.jpeg"
                  alt="Oval Dock Menu with Content"
                  fill
                  quality={70}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/switch-tab">
            <ContentBox title="Switch Tab">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/switch-tab-1.jpg"
                  alt="Mac, Arc Style Switch Tab (use Space + Tab)"
                  fill
                  quality={70}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/glow-cursor-list">
            <ContentBox title="Glow Cursor List">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/glow-cursor.jpg"
                  alt="Glow Cursor List content preview"
                  fill
                  quality={70}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/floating-video">
            <ContentBox title="floating video">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/floating-video.jpg"
                  alt="Video Player Arc Browser style"
                  fill
                  quality={70}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/random-text">
            <ContentBox title="random text">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/random-text.png"
                  alt="Random Text content preview"
                  fill
                  quality={100}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/link-preview">
            <ContentBox title="link preview">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/link_preview.jpg"
                  alt="link Preview content preview"
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/stacked-toast">
            <ContentBox title="stacked toast">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/stacked-toast.jpg"
                  alt="stacked toast content preview"
                  fill
                  quality={100}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/dynamic-card">
            <ContentBox title="dynamic card">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/dynamic-card.png"
                  alt="dynamic card content preview"
                  fill
                  quality={100}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/border-animation">
            <ContentBox title="border-animation">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/border-animation.jpg"
                  alt="Button Border Animation Preview Image"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/typing-text">
            <ContentBox title="typing-text">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/typing-text.png"
                  alt="Typing Text Effect Preview Image"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
        <ContentList.Item>
          <Link href="/blurred-logo">
            <ContentBox title="blurred-logo">
              <div className="relative w-full h-full">
                <Image
                  src="/thumbnails/blurred-logo.png"
                  alt="blurred logo content preview"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </ContentBox>
          </Link>
        </ContentList.Item>
      </ContentList>
    </PageLayout>
  );
}
