export type DomeWipeOptions = {
  seconds: number;
  charge: number;
  frontShare: number;
  ease: [number, number, number, number];
  arc: number;
  feather: number;
  pull: number;
  push: number;
  band: boolean;
  bandBlur: number;
  cloud: boolean;
  cloudBlur: number;
  cloudOpacity: number;
  cloudScaleTo: number;
  cloudHold: number;
  veil: number;
  glow: number;
  bloom: number;
  bloomSpread: number;
};

export const DEFAULT_DOME_WIPE: DomeWipeOptions = {
  seconds: 1.8,
  charge: 0.04,
  frontShare: 0.64,
  ease: [0, 0, 0.58, 0.99],
  arc: 10,
  feather: 28,
  pull: 0.995,
  push: 1.015,
  band: true,
  bandBlur: 12,
  cloud: true,
  cloudBlur: 64,
  cloudOpacity: 1,
  cloudScaleTo: 1.06,
  cloudHold: 0.47,
  veil: 0.45,
  glow: 0.6,
  bloom: 1,
  bloomSpread: 0.2,
};

export type DomeWipeTarget = {
  host: HTMLElement;
  stage: HTMLElement;
  pane: HTMLElement;
  content: HTMLElement;
  ghosts: boolean;
  fill: string;
  backdrop?: HTMLElement | null;
};

type Shade = (depth: number) => number;
type Front = { travel: number; mask: (shade: Shade) => string };

const RADIUS_Y = 4;
const MARGIN = 2;
const SAMPLES = 16;
const FLAT_ARC = 0.1;
const BLOOM_PILL = 'scale(0.17, 0.67)';
const GLOW_SEED = 'scale(0.3, 0.2)';
const BLEED = 2.5;
const COVER_MS = 200;
const COVER = '[data-wipe-cover]';
const SMOOTH_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)';
const IN_OUT = 'cubic-bezier(0.45, 0, 0.55, 1)';
const LAYER = 'pointer-events-none absolute inset-0';

function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

function smooth(value: number): number {
  const t = clamp(value);
  return t * t * (3 - 2 * t);
}

function ink(alpha: number): string {
  return `rgba(0,0,0,${clamp(alpha).toFixed(3)})`;
}

function white(alpha: number): string {
  return `rgba(255,255,255,${clamp(alpha).toFixed(3)})`;
}

function frontGeometry(
  width: number,
  height: number,
  soft: number,
  arc: number
): Front {
  const top = height + MARGIN;
  const depths = Array.from(
    { length: SAMPLES + 1 },
    (_, index) => index / SAMPLES
  );

  if (arc < FLAT_ARC) {
    return {
      travel: Math.ceil(top + soft + MARGIN),
      mask: shade =>
        `linear-gradient(to bottom, ${depths
          .map(
            depth => `${ink(shade(depth))} ${(top + depth * soft).toFixed(2)}px`
          )
          .join(', ')})`,
    };
  }

  const radiusY = RADIUS_Y * height;
  const lag = (arc / 100) * height;
  const radiusX = width / 2 / Math.sqrt(1 - (1 - lag / radiusY) ** 2);
  const centerY = top + radiusY;
  const inner = 1 - soft / radiusY;
  const edge =
    centerY -
    inner * radiusY * Math.sqrt(1 - (width / (2 * inner * radiusX)) ** 2);

  return {
    travel: Math.ceil(edge + MARGIN),
    mask: shade =>
      `radial-gradient(ellipse ${radiusX.toFixed(1)}px ${radiusY.toFixed(1)}px at 50% ${centerY.toFixed(1)}px, ${[
        ...depths,
      ]
        .reverse()
        .map(
          depth =>
            `${ink(shade(depth))} ${((1 - (depth * soft) / radiusY) * 100).toFixed(4)}%`
        )
        .join(', ')})`,
  };
}

function layer(): HTMLDivElement {
  const element = document.createElement('div');
  element.setAttribute('aria-hidden', 'true');
  element.className = LAYER;
  return element;
}

function ghost(content: HTMLElement, blur: number): HTMLDivElement {
  const box = layer();
  box.style.filter = `blur(${Math.max(0, blur)}px)`;
  const copy = content.cloneNode(true) as HTMLElement;
  for (const cover of copy.querySelectorAll<HTMLElement>(COVER)) {
    cover.style.opacity = '1';
  }
  copy.setAttribute('inert', '');
  box.appendChild(copy);
  return box;
}

function fog(content: HTMLElement, blur: number, fill: string): HTMLDivElement {
  const bleed = Math.ceil(Math.max(0, blur) * BLEED);
  const box = ghost(content, blur);
  const copy = box.firstElementChild as HTMLElement;
  const seat = layer();
  seat.style.inset = `${bleed}px`;
  seat.appendChild(copy);
  box.appendChild(seat);
  box.style.inset = `${-bleed}px`;
  if (fill) box.classList.add(...fill.split(' '));
  return box;
}

function syncScroll(content: HTMLElement, box: HTMLElement) {
  const live = content.querySelector<HTMLElement>('[data-wipe-scroll]');
  const copy = box.querySelector<HTMLElement>('[data-wipe-scroll]');
  if (!live || !copy) return;
  copy.style.overflow = 'hidden';
  copy.scrollTop = live.scrollTop;
}

function shapePane(
  pane: HTMLElement,
  hold: HTMLElement,
  travel: number,
  height: number,
  mask: string
) {
  pane.style.bottom = 'auto';
  pane.style.height = `${travel}px`;
  pane.style.overflow = 'clip';
  pane.style.willChange = 'transform';
  pane.style.setProperty('-webkit-mask-image', mask);
  pane.style.maskImage = mask;
  hold.style.bottom = 'auto';
  hold.style.height = `${height}px`;
  hold.style.willChange = 'transform';
}

export function domeWipe(
  { host, stage, pane, content, ghosts, fill, backdrop }: DomeWipeTarget,
  options: DomeWipeOptions
): Promise<void> {
  const width = host.clientWidth;
  const height = host.clientHeight;
  const soft = Math.max(1, (options.feather / 100) * height);
  const front = frontGeometry(width, height, soft, Math.max(0, options.arc));
  const banded = ghosts && options.band;
  const clouded = ghosts && options.cloud;

  const total = Math.max(0.1, options.seconds) * 1000;
  const charge = clamp(options.charge, 0, 0.5);
  const frontEnd = clamp(Math.max(charge + 0.05, options.frontShare));
  const hold = clamp(options.cloudHold, 0, 0.95);
  const rise = Math.min(charge, hold);
  const [x1, y1, x2, y2] = options.ease;
  const whole: KeyframeAnimationOptions = { duration: total, fill: 'both' };
  const sweep: KeyframeAnimationOptions = {
    delay: charge * total,
    duration: (frontEnd - charge) * total,
    easing: `cubic-bezier(${clamp(x1)}, ${y1}, ${clamp(x2)}, ${y2})`,
    fill: 'both',
  };
  const up: Keyframe[] = [
    { transform: 'translateY(0px)' },
    { transform: `translateY(${-front.travel}px)` },
  ];
  const down: Keyframe[] = [
    { transform: 'translateY(0px)' },
    { transform: `translateY(${front.travel}px)` },
  ];
  const settle = (from: number): Keyframe[] => [
    ...(rise > 0 ? [{ opacity: 0, offset: 0 }] : []),
    { opacity: from, offset: rise },
    { opacity: from, offset: hold, easing: IN_OUT },
    { opacity: 0, offset: 1 },
  ];

  const veil = layer();
  veil.style.backgroundImage = `linear-gradient(to top, ${white(options.veil)}, ${white(options.veil * 0.7)})`;

  let cloud: HTMLDivElement | null = null;
  if (clouded) {
    cloud = layer();
    cloud.style.willChange = 'transform, opacity';
    cloud.appendChild(fog(content, options.cloudBlur, fill));
    cloud.appendChild(veil);
    stage.insertBefore(cloud, pane);
    syncScroll(content, cloud);
  } else {
    host.insertBefore(veil, stage);
  }

  let bandPane: HTMLDivElement | null = null;
  let bandHold: HTMLDivElement | null = null;
  if (banded) {
    bandPane = layer();
    bandHold = layer();
    bandHold.appendChild(ghost(content, options.bandBlur));
    bandPane.appendChild(bandHold);
    stage.appendChild(bandPane);
    syncScroll(content, bandHold);
    shapePane(
      bandPane,
      bandHold,
      front.travel,
      height,
      front.mask(
        depth => smooth(depth / 0.35) * (1 - smooth((depth - 0.5) / 0.5))
      )
    );
  }

  shapePane(
    pane,
    content,
    front.travel,
    height,
    front.mask(depth =>
      banded ? 1 - smooth((depth - 0.2) / 0.3) : 1 - smooth(depth)
    )
  );

  const glow = layer();
  glow.style.inset = 'auto auto 0 -20%';
  glow.style.width = '140%';
  glow.style.height = '60%';
  glow.style.transformOrigin = '50% 100%';
  glow.style.willChange = 'transform, opacity';
  glow.style.backgroundImage = `radial-gradient(ellipse 50% 100% at 50% 100%, ${white(0.9 * options.glow)} 0%, ${white(0.45 * options.glow)} 40%, transparent 100%)`;
  host.appendChild(glow);

  const bloom = layer();
  bloom.style.inset = 'auto auto 0 -80%';
  bloom.style.width = '260%';
  bloom.style.height = '9%';
  bloom.style.transformOrigin = '50% 100%';
  bloom.style.willChange = 'transform, opacity';
  bloom.style.backgroundImage = `radial-gradient(ellipse 50% 100% at 50% 100%, ${white(0.95 * options.bloom)} 0%, ${white(0.6 * options.bloom)} 45%, transparent 100%)`;
  host.appendChild(bloom);

  stage.style.transformOrigin = '50% 100%';
  stage.style.willChange = 'transform';

  const animations: Animation[] = [
    stage.animate(
      [
        ...(charge > 0
          ? [{ transform: 'scale(1)', offset: 0, easing: SMOOTH_OUT }]
          : []),
        {
          transform: `scale(${charge > 0 ? options.pull : 1})`,
          offset: charge,
        },
        { transform: `scale(${options.push})`, offset: frontEnd },
        { transform: `scale(${options.push})`, offset: 1 },
      ],
      whole
    ),
    pane.animate(up, sweep),
    content.animate(down, sweep),
    glow.animate(settle(1), whole),
    glow.animate(
      [{ transform: GLOW_SEED }, { transform: 'scale(1, 1)' }],
      sweep
    ),
    bloom.animate(settle(1), whole),
    bloom.animate([{ transform: BLOOM_PILL }, { transform: 'scale(1, 1)' }], {
      duration: Math.max(0.01, options.bloomSpread) * total,
      easing: SMOOTH_OUT,
      fill: 'both',
    }),
  ];
  if (bandPane && bandHold) {
    animations.push(bandPane.animate(up, sweep), bandHold.animate(down, sweep));
  }
  if (!cloud) animations.push(veil.animate(settle(1), whole));
  const covering: KeyframeAnimationOptions = {
    duration: COVER_MS,
    easing: 'ease-out',
    fill: 'both',
  };
  for (const cover of content.querySelectorAll<HTMLElement>(COVER)) {
    animations.push(cover.animate([{ opacity: 1 }], covering));
  }
  if (backdrop) {
    animations.push(
      backdrop.animate([{ visibility: 'visible' }, { visibility: 'hidden' }], {
        delay: COVER_MS,
        duration: 1,
        fill: 'both',
      })
    );
  }
  if (cloud) {
    const opacity = clamp(options.cloudOpacity);
    const lead = Math.min(COVER_MS / total, hold);
    animations.push(
      cloud.animate(
        [
          { opacity: backdrop ? 0 : opacity, transform: 'scale(1)', offset: 0 },
          ...(backdrop
            ? [{ opacity, transform: 'scale(1)', offset: lead }]
            : []),
          { opacity, transform: 'scale(1)', offset: hold, easing: IN_OUT },
          {
            opacity: 0,
            transform: `scale(${options.cloudScaleTo})`,
            offset: 1,
          },
        ],
        whole
      )
    );
  }

  return Promise.allSettled(
    animations.map(animation => animation.finished)
  ).then(() => undefined);
}
