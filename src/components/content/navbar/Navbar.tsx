'use client';

import { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';

import { cn } from '@/utils/cn';

const defaultNavLinks = [
  { label: 'Introduction', href: '#introduction' },
  { label: 'FAQ', href: '#faq' },
];

const menuLinks = [
  { label: 'Blog', href: '#' },
  { label: 'About', href: '#' },
];

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
      viewBox="0 0 24 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm8 0a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z"
      />
    </svg>
  );
}

function LogoWordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'block w-13 text-[15px] font-bold leading-4 tracking-tight whitespace-nowrap',
        className
      )}
    >
      Acme
    </span>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01ZM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25Z" />
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

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToAnchor(href: string) {
  window.history.pushState(null, '', href);
  const el = document.querySelector<HTMLElement>(href);
  if (!el) {
    return;
  }
  const isScrollingDown = el.getBoundingClientRect().top > 0;
  const offset = isScrollingDown ? 0 : -80;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior: 'smooth' });
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
    e.preventDefault();
    setMobileOpen(false);
    if (href.startsWith('#') && href.length > 1) {
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
            className="flex w-[84px] items-center"
            onClick={e => {
              e.preventDefault();
              scrollToTop();
            }}
          >
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
              href="#"
              onClick={e => e.preventDefault()}
              className={cn(
                'flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-3.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current',
                isDark
                  ? 'bg-white/10 text-white hover:bg-white/15'
                  : 'bg-black/5 text-black hover:bg-black/10'
              )}
              aria-label="Get the App"
            >
              <AppleIcon className="size-4" />
              <span className="text-[13px] font-medium leading-none">
                Get the App
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
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center justify-center rounded-[18px] bg-[#222] py-3 text-[15px] font-medium text-white transition-colors hover:bg-[#222]/90"
                >
                  Create your account
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
  const wordmarkWidth = useTransform(navMaxWidth, [1024, 720], [52, 0], {
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
    e.preventDefault();
    if (href.startsWith('#') && href.length > 1) {
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
              'h-4 w-6 shrink-0',
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
              onClick={e => handleNavClick(e, link.href)}
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
            href="#"
            onClick={e => e.preventDefault()}
            className="flex h-12 shrink-0 items-center justify-center rounded-[18px] bg-[#222] px-6 text-[15px] font-medium leading-[15px] text-white transition-colors hover:bg-[#222]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current"
          >
            Sign Up
          </a>
        </div>
      </div>
    </motion.nav>
  );
}
