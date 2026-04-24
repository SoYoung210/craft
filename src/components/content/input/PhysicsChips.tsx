'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

import { cn } from '@/utils/cn';

import { AddOccupationInput } from './AddOccupationInput';
import { DEFAULT_TAGS, type TagItem } from './constants';

interface ChipBody {
  slug: string;
  label: string;
  isCustom: boolean;
  gradient?: string;
  textColor?: string;
  body: Matter.Body;
  width: number;
  height: number;
}

function randomGradient() {
  const hue = Math.floor(Math.random() * 360);
  const hue2 = hue + 25 + Math.floor(Math.random() * 30);
  const x = 20 + Math.floor(Math.random() * 60);
  const y = 20 + Math.floor(Math.random() * 60);
  return {
    gradient: `radial-gradient(ellipse at ${x}% ${y}%, hsl(${hue} 75% 95%), hsl(${hue2} 65% 92%))`,
    textColor: `hsl(${hue + 10} 55% 40%)`,
  };
}

const CHIP_HEIGHT = 48;
const WALL_THICKNESS = 40;

const DEFAULT_SELECTED = ['typography', 'responsive', 'animation'];

function estimateChipWidth(label: string) {
  return label.length * 9 + 40 + 14 + 8;
}

export function PhysicsChips() {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const chipBodiesRef = useRef<Map<string, ChipBody>>(new Map());
  const wallsRef = useRef<Matter.Body[]>([]);
  const rafRef = useRef<number>(0);
  const initializedRef = useRef(false);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(DEFAULT_SELECTED)
  );
  const [customItems, setCustomItems] = useState<string[]>([]);
  const [positions, setPositions] = useState<
    Map<string, { x: number; y: number; angle: number }>
  >(new Map());

  const addChipBody = useCallback(
    (slug: string, label: string, isCustom: boolean) => {
      const engine = engineRef.current;
      const container = containerRef.current;
      if (!engine || !container) return;
      if (chipBodiesRef.current.has(slug)) return;

      const { width } = container.getBoundingClientRect();
      const chipWidth = estimateChipWidth(label);

      const x = Math.random() * (width - chipWidth - 40) + chipWidth / 2 + 20;
      const y = -CHIP_HEIGHT - Math.random() * 60;

      const body = Matter.Bodies.rectangle(x, y, chipWidth, CHIP_HEIGHT, {
        chamfer: { radius: CHIP_HEIGHT / 2 },
        friction: 0.6,
        frictionAir: 0.01,
        restitution: 0.15,
        density: 0.002,
        angle: (Math.random() - 0.5) * 0.3,
      });

      Matter.Body.setVelocity(body, {
        x: (Math.random() - 0.5) * 2,
        y: 2,
      });

      Matter.World.add(engine.world, body);
      const colors = randomGradient();
      chipBodiesRef.current.set(slug, {
        slug,
        label,
        isCustom,
        gradient: colors.gradient,
        textColor: colors.textColor,
        body,
        width: chipWidth,
        height: CHIP_HEIGHT,
      });
    },
    []
  );

  const removeChipBody = useCallback((slug: string) => {
    const engine = engineRef.current;
    if (!engine) return;

    const chip = chipBodiesRef.current.get(slug);
    if (chip) {
      Matter.World.remove(engine.world, chip.body);
      chipBodiesRef.current.delete(slug);
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 1.2, scale: 0.001 },
      enableSleeping: true,
    });
    engineRef.current = engine;

    const updateWalls = () => {
      const { width, height } = container.getBoundingClientRect();

      wallsRef.current.forEach(w => Matter.World.remove(engine.world, w));

      const floor = Matter.Bodies.rectangle(
        width / 2,
        height + WALL_THICKNESS / 2,
        width * 2,
        WALL_THICKNESS,
        { isStatic: true, friction: 0.8, restitution: 0.1 }
      );
      const leftWall = Matter.Bodies.rectangle(
        -WALL_THICKNESS / 2,
        height / 2,
        WALL_THICKNESS,
        height * 3,
        { isStatic: true, friction: 0.3 }
      );
      const rightWall = Matter.Bodies.rectangle(
        width + WALL_THICKNESS / 2,
        height / 2,
        WALL_THICKNESS,
        height * 3,
        { isStatic: true, friction: 0.3 }
      );

      wallsRef.current = [floor, leftWall, rightWall];
      Matter.World.add(engine.world, wallsRef.current);
    };

    updateWalls();

    const observer = new ResizeObserver(() => updateWalls());
    observer.observe(container);

    if (!initializedRef.current) {
      initializedRef.current = true;
      DEFAULT_SELECTED.forEach(slug => {
        const tag = DEFAULT_TAGS.find(t => t.slug === slug);
        if (tag) {
          addChipBody(slug, tag.label, false);
        }
      });
    }

    const loop = () => {
      Matter.Engine.update(engine, 1000 / 60);

      let hasAwake = false;
      chipBodiesRef.current.forEach(chip => {
        if (!chip.body.isSleeping) hasAwake = true;
      });

      if (hasAwake || chipBodiesRef.current.size === 0) {
        const next = new Map<string, { x: number; y: number; angle: number }>();
        chipBodiesRef.current.forEach((chip, s) => {
          next.set(s, {
            x: chip.body.position.x,
            y: chip.body.position.y,
            angle: chip.body.angle,
          });
        });
        setPositions(next);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      Matter.Engine.clear(engine);
    };
  }, [addChipBody]);

  const toggle = useCallback(
    (slug: string, label: string, isCustom: boolean) => {
      setSelected(prev => {
        const next = new Set(prev);
        if (next.has(slug)) {
          next.delete(slug);
          removeChipBody(slug);
        } else {
          next.add(slug);
          addChipBody(slug, label, isCustom);
        }
        return next;
      });
    },
    [addChipBody, removeChipBody]
  );

  const addCustomItem = useCallback(
    (value: string) => {
      const slug = value.toLowerCase().replace(/\s+/g, '-');
      if (selected.has(slug) || DEFAULT_TAGS.some(o => o.slug === slug)) return;
      setCustomItems(prev => [...prev, value]);
      setSelected(prev => new Set(prev).add(slug));
      addChipBody(slug, value, true);
    },
    [selected, addChipBody]
  );

  const removeCustomItem = useCallback(
    (slug: string) => {
      setCustomItems(prev =>
        prev.filter(v => v.toLowerCase().replace(/\s+/g, '-') !== slug)
      );
      setSelected(prev => {
        const next = new Set(prev);
        next.delete(slug);
        return next;
      });
      removeChipBody(slug);
    },
    [removeChipBody]
  );

  const allTags: (TagItem & { isCustom: boolean })[] = [
    ...DEFAULT_TAGS.map(o => ({ ...o, isCustom: false })),
    ...customItems.map(v => ({
      slug: v.toLowerCase().replace(/\s+/g, '-'),
      label: v,
      isCustom: true,
    })),
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl bg-gray-0"
      style={{ aspectRatio: '16 / 9' }}
    >
      <div className="relative z-10 flex flex-col items-center gap-6 px-6 pt-10">
        <div className="flex max-w-[704px] flex-wrap items-center justify-center gap-2">
          {allTags.map(item => {
            const isSelected = selected.has(item.slug);
            return (
              <button
                key={item.slug}
                type="button"
                onClick={() =>
                  item.isCustom
                    ? removeCustomItem(item.slug)
                    : toggle(item.slug, item.label, item.isCustom)
                }
                className={cn(
                  'flex h-12 items-center gap-2 rounded-full border px-4 text-[17px] font-medium transition-all duration-300',
                  isSelected || item.isCustom
                    ? 'border-gray-3 bg-gray-2 text-gray-5 line-through decoration-gray-4'
                    : 'border-gray-3 bg-white text-gray-7 hover:border-gray-4'
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <AddOccupationInput onAdd={addCustomItem} />
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from(chipBodiesRef.current.entries()).map(([slug, chip]) => {
          const pos = positions.get(slug);
          if (!pos) return null;

          return (
            <div
              key={slug}
              className="pointer-events-auto absolute flex h-12 cursor-pointer items-center gap-2 rounded-full px-5 text-[17px] font-medium shadow-md"
              style={{
                left: pos.x - chip.width / 2,
                top: pos.y - chip.height / 2,
                transform: `rotate(${pos.angle}rad)`,
                willChange: 'transform, left, top',
                background: chip.gradient,
                color: chip.textColor,
              }}
              onClick={() => {
                if (chip.isCustom) {
                  removeCustomItem(slug);
                } else {
                  toggle(slug, chip.label, false);
                }
              }}
            >
              {chip.label}
              <svg
                width={14}
                height={14}
                viewBox="0 0 24 24"
                fill="none"
                className="shrink-0 opacity-40"
              >
                <path
                  d="M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
