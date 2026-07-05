'use client';

import { useState, useEffect } from 'react';
import {
  animate,
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

import { cn } from '@/utils/cn';

const defaultNavLinks = [
  { label: 'News', href: '#news' },
  { label: 'Career', href: '#career' },
];

const menuLinks = [
  { label: 'Gallery', href: 'https://news.verstappen.com/en/gallery' },
  { label: 'Tickets', href: 'https://www.verstappen.com/tickets' },
];

const shopUrl =
  'https://store.verstappen.com/en/?_s=bm-fi-mv-prtsite-general-splashpage-190126-al';

const springTransition = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
};

const menuSpring = {
  type: 'spring' as const,
  stiffness: 480,
  damping: 50,
};

const iconTransition = {
  opacity: { duration: 0.3, ease: 'easeOut' as const },
  scale: menuSpring,
};

function LogoSymbol({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 674 336"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M561.703 156.65L673.914 268.775H449.493L561.703 156.65Z" />
      <path d="M112.21 156.65L224.747 268.775H0L112.21 156.65Z" />
      <path d="M336.957 335.725L0 0L213.33 33.475L336.957 156.65L460.584 33.475L673.914 0L336.957 335.725Z" />
    </svg>
  );
}

function LogoWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'block w-10 text-[15px] font-bold leading-4 tracking-[0.08em] whitespace-nowrap',
        className
      )}
    >
      MAX
    </span>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M5.5 3.87c0-.86.94-1.39 1.68-.95l6.88 4.13a1.1 1.1 0 0 1 0 1.9l-6.88 4.13a1.1 1.1 0 0 1-1.68-.95V3.87Z" />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block size-4">
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 14 14"
        fill="none"
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0 : 1 }}
        transition={iconTransition}
      >
        <line
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          x1="2.5"
          y1="4"
          x2="11.5"
          y2="4"
        />
        <line
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          x1="2.5"
          y1="7"
          x2="11.5"
          y2="7"
        />
        <line
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          x1="2.5"
          y1="10"
          x2="11.5"
          y2="10"
        />
      </motion.svg>
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 14 14"
        fill="none"
        className="absolute inset-0"
        initial={false}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0 }}
        transition={iconTransition}
      >
        <line
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          x1="3.5"
          y1="3.5"
          x2="10.5"
          y2="10.5"
        />
        <line
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          x1="10.5"
          y1="3.5"
          x2="3.5"
          y2="10.5"
        />
      </motion.svg>
    </span>
  );
}

function animateScrollTo(top: number) {
  const maxTop = document.documentElement.scrollHeight - window.innerHeight;
  animate(window.scrollY, Math.min(Math.max(top, 0), maxTop), {
    ...menuSpring,
    onUpdate: v => window.scrollTo(0, v),
  });
}

function scrollToTop() {
  animateScrollTo(0);
}

function scrollToAnchor(href: string) {
  window.history.pushState(null, '', href);
  const el = document.querySelector<HTMLElement>(href);
  if (!el) {
    return;
  }
  const isScrollingDown = el.getBoundingClientRect().top > 0;
  const offset = isScrollingDown ? 0 : -80;
  animateScrollTo(el.getBoundingClientRect().top + window.scrollY + offset);
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrolled;
}

function usePastSentinel(themeSwitchAfter?: string) {
  const [pastSentinel, setPastSentinel] = useState(false);

  useEffect(() => {
    if (!themeSwitchAfter) {
      return;
    }
    const el = document.querySelector(themeSwitchAfter);
    if (!el) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastSentinel(
          !entry.isIntersecting && entry.boundingClientRect.top < 0
        );
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [themeSwitchAfter]);

  return pastSentinel;
}

interface NavbarProps {
  theme?: 'light' | 'dark';
  themeSwitchAfter?: string;
  links?: { label: string; href: string }[];
}

export function Navbar(props: NavbarProps) {
  return (
    <>
      <MobileNav {...props} />
      <DesktopNav {...props} />
    </>
  );
}

function MobileNav({
  theme = 'light',
  themeSwitchAfter,
  links = defaultNavLinks,
}: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrolled();
  const pastSentinel = usePastSentinel(themeSwitchAfter);
  const isDark =
    (themeSwitchAfter && pastSentinel ? 'light' : theme) === 'dark';

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMobileOpen(false);
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      scrollToAnchor(href);
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-2 right-4 left-4 z-50 rounded-2xl px-6 py-3 backdrop-blur-lg duration-300 ease-[cubic-bezier(.33,1,.68,1)] transition-colors lg:hidden',
        scrolled
          ? isDark
            ? 'border-[0.5px] border-white/10 bg-black/85'
            : 'border-[0.5px] border-black/10 bg-white/85'
          : isDark
            ? 'border-[0.5px] border-white/10 bg-black/70'
            : 'border-[0.5px] border-black/10 bg-white/70'
      )}
    >
      <div className="flex items-center justify-between">
        <motion.div
          layout="position"
          animate={{ x: mobileOpen ? 12 : 0, y: mobileOpen ? 10 : 0 }}
          transition={menuSpring}
        >
          <a
            href="#"
            className="flex w-[84px] items-center gap-2"
            onClick={e => {
              e.preventDefault();
              scrollToTop();
            }}
          >
            <LogoSymbol
              className={cn(
                'h-4 w-8 shrink-0',
                isDark ? 'fill-white' : 'fill-black'
              )}
            />
            <LogoWordmark className={isDark ? 'text-white' : 'text-black'} />
          </a>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.div
            layout="position"
            animate={{ y: mobileOpen ? 10 : 0 }}
            transition={menuSpring}
            className="mr-2"
          >
            <a
              href="https://www.youtube.com/watch?v=MTe12fH2xtQ"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/15'
                  : 'bg-black/5 text-black hover:bg-black/10'
              )}
              aria-label="Watch the 2021 Abu Dhabi GP finale"
            >
              <PlayIcon className="size-4" />
              <span className="text-[13px] font-medium leading-none">
                Abu Dhabi 2021
              </span>
            </a>
          </motion.div>
          <motion.button
            className={cn(
              "relative will-change-transform after:absolute after:-inset-3 after:content-['']",
              isDark ? 'text-white' : 'text-black'
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            animate={{ x: mobileOpen ? -8 : 0, y: mobileOpen ? 10 : 0 }}
            transition={menuSpring}
          >
            <MenuIcon open={mobileOpen} />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={menuSpring}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-6 pb-2">
              {[...links, ...menuLinks].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('#') ? undefined : '_blank'}
                  rel={
                    link.href.startsWith('#')
                      ? undefined
                      : 'noopener noreferrer'
                  }
                  onClick={e => handleNavClick(e, link.href)}
                  className={cn(
                    'rounded-[18px] px-3 py-2.5 text-[15px] font-medium transition-colors',
                    isDark
                      ? 'text-white/70 hover:bg-white/5 hover:text-white'
                      : 'text-black/70 hover:bg-black/5 hover:text-black'
                  )}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2">
                <a
                  href={shopUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-[18px] bg-[#222] py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#222]/90"
                >
                  Visit the Shop
                </a>
              </div>
              <a
                href="#"
                onClick={e => {
                  e.preventDefault();
                  setMobileOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-center rounded-[18px] py-3 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
                  isDark
                    ? 'text-white/70 hover:bg-white/5 hover:text-white'
                    : 'text-black/70 hover:bg-black/5 hover:text-black'
                )}
              >
                Sign In
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function DesktopNav({
  theme = 'light',
  themeSwitchAfter,
  links = defaultNavLinks,
}: NavbarProps) {
  const scrolled = useScrolled();
  const pastSentinel = usePastSentinel(themeSwitchAfter);
  const isDark =
    (themeSwitchAfter && pastSentinel ? 'light' : theme) === 'dark';

  const widthTarget = useMotionValue(1024);
  const navMaxWidth = useSpring(widthTarget, { stiffness: 600, damping: 45 });
  const navMaxWidthPx = useTransform(navMaxWidth, v => `${v}px`);
  const wordmarkWidth = useTransform(navMaxWidth, [1024, 720], [40, 0], {
    clamp: true,
  });
  const wordmarkOpacity = useTransform(navMaxWidth, [1024, 720], [1, 0], {
    clamp: true,
  });
  const wordmarkMarginLeft = useTransform(navMaxWidth, [1024, 720], [0, -8], {
    clamp: true,
  });

  const isShrunk = themeSwitchAfter ? pastSentinel : scrolled;
  useEffect(() => {
    widthTarget.set(isShrunk ? 720 : 1024);
  }, [isShrunk, widthTarget]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      scrollToAnchor(href);
    }
  };

  return (
    <motion.nav
      layout
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut', layout: springTransition }}
      style={{ maxWidth: navMaxWidthPx }}
      className={cn(
        'fixed top-4 right-0 left-0 z-50 mx-auto hidden rounded-2xl px-6 pr-3 py-2 backdrop-blur-lg duration-500 ease-[cubic-bezier(.33,1,.68,1)] transition-colors will-change-transform lg:block',
        scrolled
          ? isDark
            ? 'border-[0.5px] border-white/10 bg-black/85'
            : 'border-[0.5px] border-black/10 bg-white/85'
          : isDark
            ? 'border-[0.5px] border-white/10 bg-black/70'
            : 'border-[0.5px] border-black/10 bg-white/70'
      )}
    >
      <div className="flex items-center justify-between">
        <a
          href="#"
          className="flex items-center gap-2"
          onClick={e => {
            e.preventDefault();
            scrollToTop();
          }}
        >
          <LogoSymbol
            className={cn(
              'h-4 w-8 shrink-0',
              isDark ? 'fill-white' : 'fill-black'
            )}
          />
          <motion.div
            style={{
              width: wordmarkWidth,
              opacity: wordmarkOpacity,
              marginLeft: wordmarkMarginLeft,
            }}
            className="overflow-hidden"
          >
            <LogoWordmark
              className={cn('shrink-0', isDark ? 'text-white' : 'text-black')}
            />
          </motion.div>
        </a>

        <div
          className={cn(
            'flex items-center gap-[25px] text-[14px] leading-4.5 font-medium',
            isDark ? 'text-white/50' : 'text-black/50'
          )}
        >
          {links.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={e => handleNavClick(e, link.href)}
              className={cn(
                'rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
                isDark ? 'hover:text-white' : 'hover:text-black'
              )}
            >
              {link.label}
            </a>
          ))}
          <div
            className={cn('h-4.5 w-px', isDark ? 'bg-white/10' : 'bg-black/10')}
          />
          {menuLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
                isDark ? 'hover:text-white' : 'hover:text-black'
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href="#"
            onClick={e => e.preventDefault()}
            className={cn(
              'flex shrink-0 items-center justify-center rounded-[18px] px-5 py-2.5 text-[15px] font-medium leading-[15px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
              isDark
                ? 'text-white/60 hover:text-white'
                : 'text-black/60 hover:text-black'
            )}
          >
            Login
          </a>
          <a
            href={shopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 shrink-0 items-center justify-center rounded-[18px] bg-[#222] px-6 text-[15px] font-medium leading-[15px] text-white transition-colors hover:bg-[#222]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            Shop
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
