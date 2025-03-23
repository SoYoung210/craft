import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
  useCallback,
  useId,
} from 'react';
import { Primitive } from '@radix-ui/react-primitive';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { ChevronDown, ChevronUp, Move } from 'lucide-react';

import { cn } from '../../../utils/css';

import { CircleProgress } from './CircleProgress';

// Context for the DynamicIslandTOC
type DynamicIslandTOCContextType = {
  registerHeading: (id: string, text: string, element: HTMLElement) => void;
  activeHeadingId: string | null;
  setActiveHeadingId: (id: string | null) => void;
};

const DynamicIslandTOCContext =
  createContext<DynamicIslandTOCContextType | null>(null);

// Hook to use the context
const useDynamicIslandTOC = () => {
  const context = useContext(DynamicIslandTOCContext);
  if (!context) {
    throw new Error(
      'useDynamicIslandTOC must be used within a DynamicIslandTOC provider'
    );
  }
  return context;
};

type Heading = {
  id: string;
  text: string;
  element: HTMLElement;
};

type DynamicIslandTOCProps = {
  className?: string;
  children?: ReactNode;
};

type HeadingProps = {
  children: ReactNode;
  id?: string;
};
type Position = 'top' | 'right' | 'bottom' | 'left';
// Main component
function DynamicIslandTOCRoot({ className, children }: DynamicIslandTOCProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>('top');
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [positionCoords, setPositionCoords] = useState({ x: 0.5, y: 0 });
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingsMapRef = useRef<Map<string, Heading>>(new Map());
  const isInitialRenderRef = useRef(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const islandRef = useRef<HTMLDivElement>(null);
  const windowSizeRef = useRef({ width: 0, height: 0 });
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  // Add a new state variable to track orientation
  const [isVertical, setIsVertical] = useState(false);
  const motionDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWindowSize = () => {
      windowSizeRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    };

    // Initialize on mount
    updateWindowSize();

    // Update on resize
    window.addEventListener('resize', updateWindowSize);

    return () => {
      window.removeEventListener('resize', updateWindowSize);
    };
  }, []);

  // Function to calculate scroll offset based on screen size and preferences
  const getScrollOffset = useCallback(() => {
    // Base offset for the fixed header
    let offset = 60;

    // Adjust for smaller screens
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        // sm breakpoint
        offset = 50;
      }

      // Check if the user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        // Use a slightly larger offset for non-smooth scrolling
        offset += 10;
      }
    }

    return offset;
  }, []);

  // Register a heading - memoized with useCallback to prevent infinite loops
  const registerHeading = useCallback(
    (id: string, text: string, element: HTMLElement) => {
      // Check if this heading is already registered with the same properties
      const existingHeading = headingsMapRef.current.get(id);
      if (
        existingHeading &&
        existingHeading.text === text &&
        existingHeading.element === element
      ) {
        return; // Skip if already registered with same properties
      }

      // Update the map with the new heading
      headingsMapRef.current.set(id, { id, text, element });

      // Update the headings array - but don't trigger a re-render on every heading registration
      // Instead, use a timeout to batch updates
      if (isInitialRenderRef.current) {
        setTimeout(() => {
          setHeadings(
            Array.from(headingsMapRef.current.values()).sort((a, b) => {
              // Sort by document position
              return a.element.compareDocumentPosition(b.element) &
                Node.DOCUMENT_POSITION_FOLLOWING
                ? -1
                : 1;
            })
          );
          isInitialRenderRef.current = false;
        }, 0);
      } else {
        setHeadings(
          Array.from(headingsMapRef.current.values()).sort((a, b) => {
            // Sort by document position
            return a.element.compareDocumentPosition(b.element) &
              Node.DOCUMENT_POSITION_FOLLOWING
              ? -1
              : 1;
          })
        );
      }

      // Set up intersection observer for this heading
      if (observerRef.current) {
        observerRef.current.observe(element);
      }
    },
    []
  );

  // Set up intersection observer to track which heading is currently visible
  useEffect(() => {
    // Disconnect any existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Calculate rootMargin based on the header height
    const headerHeight = getScrollOffset();
    const rootMargin = `-${headerHeight}px 0px -66%`;

    const options = {
      rootMargin,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    };

    // Create a map to track intersection ratios
    const intersectionRatios = new Map();

    observerRef.current = new IntersectionObserver(entries => {
      // Update intersection ratios for each entry
      entries.forEach(entry => {
        intersectionRatios.set(entry.target.id, entry.intersectionRatio);
      });

      // Find the heading with the highest intersection ratio
      let highestRatio = 0;
      let mostVisibleHeadingId = null;

      intersectionRatios.forEach((ratio, id) => {
        if (ratio > highestRatio) {
          highestRatio = ratio;
          mostVisibleHeadingId = id;
        }
      });

      // Only update if we found a visible heading
      if (mostVisibleHeadingId && highestRatio > 0) {
        setActiveHeadingId(mostVisibleHeadingId);
      }
    }, options);

    // Observe all existing headings
    headings.forEach(heading => {
      observerRef.current?.observe(heading.element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [headings, getScrollOffset]);

  // Set up scroll tracking for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.round((scrollTop / scrollHeight) * 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add smooth scrolling behavior to the document
  useEffect(() => {
    // Add smooth scrolling to the document
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
      }
      .target-heading {
        position: relative;
        animation: highlight-pulse 2s ease-out;
      }
      @keyframes highlight-pulse {
        0% {
          background-color: rgba(255, 255, 255, 0);
        }
        20% {
          background-color: rgba(59, 130, 246, 0.1);
        }
        100% {
          background-color: rgba(255, 255, 255, 0);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const toggleIsland = () => {
    if (!isDragging) {
      setIsExpanded(!isExpanded);
    }
  };

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with id "${id}" not found`);
      return;
    }

    // Prevent the default hash change behavior
    window.history.pushState(null, '', `#${id}`);

    // Set active heading immediately for visual feedback
    setActiveHeadingId(id);

    // Get the height of the fixed header
    const headerHeight = getScrollOffset();

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      try {
        // Get the element's position
        const rect = element.getBoundingClientRect();

        // Calculate the absolute position on the page
        const absoluteTop = rect.top + window.pageYOffset;

        // Subtract the header height to account for the fixed header
        const scrollPosition = absoluteTop - headerHeight;

        // Scroll with smooth behavior
        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });

        // Add a class to highlight the target element temporarily
        element.classList.add('target-heading');
        setTimeout(() => {
          element.classList.remove('target-heading');
        }, 2000);
      } catch (error) {
        console.error('Error scrolling to heading:', error);

        // Fallback: use the native scrollIntoView as a last resort
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  };

  // Function to handle drag start
  const handleDragStart = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    try {
      // Try to get the element from the event or from our ref
      const element = (event.currentTarget ||
        motionDivRef.current) as HTMLElement | null;

      if (element) {
        // If we have an element, get its bounding rect
        const rect = element.getBoundingClientRect();
        const offsetX = info.point.x - rect.left;
        const offsetY = info.point.y - rect.top;

        // Store these offsets for use during dragging
        dragOffsetRef.current = { x: offsetX, y: offsetY };
      } else {
        // Fallback: use center point offsets
        dragOffsetRef.current = { x: 15, y: 15 };
      }

      setIsDragging(true);
      setDragPosition({ x: info.point.x, y: info.point.y });
    } catch (error) {
      console.error('Error in drag start:', error);
      // Ensure we still set dragging state even if there's an error
      setIsDragging(true);
      setDragPosition({ x: info.point.x, y: info.point.y });
    }
  };

  // Function to handle drag
  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    requestAnimationFrame(() => {
      setDragPosition({ x: info.point.x, y: info.point.y });
    });
  };

  // Refined function to determine which edge to snap to
  const determineSnapPosition = (
    x: number,
    y: number
  ): { edge: Position; normalizedCoord: number } => {
    const windowWidth = windowSizeRef.current.width;
    const windowHeight = windowSizeRef.current.height;

    // Calculate distances to each edge
    const distanceToTop = y;
    const distanceToBottom = windowHeight - y;
    const distanceToLeft = x;
    const distanceToRight = windowWidth - x;

    // Find the minimum distance to determine the closest edge
    const minDistance = Math.min(
      distanceToTop,
      distanceToBottom,
      distanceToLeft,
      distanceToRight
    );

    // Determine which edge is closest and calculate the normalized coordinate along that edge
    if (minDistance === distanceToTop) {
      // Top edge - normalize x coordinate (0 = left, 1 = right)
      return {
        edge: 'top',
        normalizedCoord: Math.max(0, Math.min(1, x / windowWidth)),
      };
    }

    if (minDistance === distanceToBottom) {
      // Bottom edge - normalize x coordinate (0 = left, 1 = right)
      return {
        edge: 'bottom',
        normalizedCoord: Math.max(0, Math.min(1, x / windowWidth)),
      };
    }

    if (minDistance === distanceToLeft) {
      // Left edge - normalize y coordinate (0 = top, 1 = bottom)
      return {
        edge: 'left',
        normalizedCoord: Math.max(0, Math.min(1, y / windowHeight)),
      };
    }

    // Right edge - normalize y coordinate (0 = top, 1 = bottom)
    return {
      edge: 'right',
      normalizedCoord: Math.max(0, Math.min(1, y / windowHeight)),
    };
  };

  // Handle drag end - snap to nearest edge
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { x: number; y: number } }
  ) => {
    setIsDragging(false);

    // Get current position from the drag event info
    const currentX = info.point.x;
    const currentY = info.point.y;

    // Determine which edge to snap to and the position along that edge
    const { edge, normalizedCoord } = determineSnapPosition(currentX, currentY);

    // Update the position state
    setPosition(edge);

    // Set orientation based on the edge
    setIsVertical(edge === 'left' || edge === 'right');

    // Update the normalized coordinate along the edge
    if (edge === 'top' || edge === 'bottom') {
      setPositionCoords({ x: normalizedCoord, y: edge === 'top' ? 0 : 1 });
    } else {
      setPositionCoords({ x: edge === 'left' ? 0 : 1, y: normalizedCoord });
    }
  };

  const getPositionStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 50,
      transition: isDragging
        ? 'none'
        : 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
    };

    if (isDragging) {
      // During drag, position exactly at cursor position, accounting for the grab point
      return {
        ...styles,
        position: 'fixed',
        left: dragPosition.x - 15, // Center the 30x30 circle on cursor
        top: dragPosition.y - 15,
        transform: 'none',
        transition: 'none',
      };
    }

    // Calculate the component dimensions based on orientation and expanded state
    const width = isExpanded ? 340 : isVertical ? 32 : 120;
    const height = isExpanded ? 240 : isVertical ? 120 : 32;

    // Calculate the safe area padding (distance from edge)
    const edgePadding = 16;

    // Calculate window dimensions
    const windowWidth = windowSizeRef.current.width;
    const windowHeight = windowSizeRef.current.height;

    // Calculate the maximum x and y positions to keep the component within the viewport
    const maxX = windowWidth - width - edgePadding;
    const maxY = windowHeight - height - edgePadding;

    // When not dragging, position based on the edge and normalized coordinate
    switch (position) {
      case 'top': {
        // Position along the top edge
        const topX = Math.max(
          edgePadding,
          Math.min(maxX, positionCoords.x * windowWidth - width / 2)
        );
        return { ...styles, top: edgePadding, left: topX, transform: 'none' };
      }

      case 'bottom': {
        // Position along the bottom edge
        const bottomX = Math.max(
          edgePadding,
          Math.min(maxX, positionCoords.x * windowWidth - width / 2)
        );
        return {
          ...styles,
          bottom: edgePadding,
          left: bottomX,
          transform: 'none',
        };
      }

      case 'left': {
        // Position along the left edge
        const leftY = Math.max(
          edgePadding,
          Math.min(maxY, positionCoords.y * windowHeight - height / 2)
        );
        return { ...styles, left: edgePadding, top: leftY, transform: 'none' };
      }

      case 'right': {
        // Position along the right edge
        const rightY = Math.max(
          edgePadding,
          Math.min(maxY, positionCoords.y * windowHeight - height / 2)
        );
        return {
          ...styles,
          right: edgePadding,
          top: rightY,
          transform: 'none',
        };
      }

      default:
        // Default to top center
        return {
          ...styles,
          top: edgePadding,
          left: '50%',
          transform: 'translateX(-50%)',
        };
    }
  };

  // Memoized context value to prevent unnecessary re-renders
  const contextValue = React.useMemo(
    () => ({
      registerHeading,
      activeHeadingId,
      setActiveHeadingId,
    }),
    [registerHeading, activeHeadingId, setActiveHeadingId]
  );

  return (
    <DynamicIslandTOCContext.Provider value={contextValue}>
      {/* Render content in the main document flow */}
      <div ref={contentRef} className="dynamic-island-content">
        {children}
      </div>

      <div
        ref={islandRef}
        className={cn('fixed z-50', className)}
        style={getPositionStyles()}
      >
        <LayoutGroup>
          <motion.div
            ref={motionDivRef}
            layout
            className={cn(
              'bg-black shadow-lg cursor-grab overflow-hidden rounded-3xl',
              isDragging
                ? 'opacity-90 cursor-grabbing rounded-full'
                : 'opacity-100',
              isVertical && !isDragging ? 'dynamic-island-vertical' : ''
            )}
            style={{
              transition: isDragging
                ? 'none'
                : 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
            initial={false}
            animate={{
              width: isDragging ? 30 : isExpanded ? 340 : isVertical ? 32 : 120,
              height: isDragging ? 30 : isExpanded ? 240 : isVertical ? 80 : 32,
            }}
            onClick={toggleIsland}
            drag={true}
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
            whileDrag={{
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              cursor: 'grabbing',
            }}
          >
            {/* Only show content when not dragging */}
            {!isDragging && (
              <>
                {/* Notch Content (Always Visible) */}
                <motion.div
                  layout="position"
                  className={cn(
                    'flex items-center px-4',
                    isVertical
                      ? 'flex-col justify-center h-full py-4'
                      : 'justify-between h-[32px] pl-2',
                    isExpanded && !isVertical && 'pl-4 pt-4'
                  )}
                >
                  <motion.div
                    layout="position"
                    className={cn(
                      'flex items-center',
                      isVertical
                        ? 'flex-col-reverse h-full justify-between'
                        : 'space-x-2'
                    )}
                  >
                    <CircleProgress
                      percentage={readingProgress}
                      size={20}
                      strokeWidth={4}
                      trackColor="#8A8990"
                      indicatorColor="#ebebeb"
                      showPercentage={false}
                    />

                    {!isVertical && (
                      <motion.div
                        layout="position"
                        className="text-white text-xs font-medium flex items-center justify-center"
                      >
                        <div>Contents</div>
                        {isExpanded ? (
                          <ChevronUp className="w-3 h-3 text-white" />
                        ) : (
                          <ChevronDown className="w-3 h-3 text-white" />
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Expanded Content */}
                <AnimatePresence mode="popLayout">
                  {isExpanded && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        delay: 0.1,
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                      }}
                      className="p-4 text-white"
                    >
                      {/* Content Area */}
                      <motion.div layout className="h-[180px]">
                        <motion.div
                          key="toc-content"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                          className="space-y-1 overflow-y-auto max-h-[180px] pr-2 scrollbar-thin"
                        >
                          {headings.length > 0 ? (
                            headings.map(heading => (
                              <motion.button
                                key={heading.id}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className={cn(
                                  'block text-left w-full truncate py-1 text-sm transition-colors',
                                  activeHeadingId === heading.id
                                    ? 'text-white'
                                    : 'text-white/70 hover:text-white'
                                )}
                                onClick={e => {
                                  e.stopPropagation();
                                  scrollToHeading(heading.id);
                                }}
                              >
                                <div className="flex items-center">
                                  {activeHeadingId === heading.id && (
                                    <motion.div
                                      layoutId="activeIndicator"
                                      className="w-1 h-1 bg-white rounded-full mr-2"
                                    />
                                  )}
                                  <span
                                    className={
                                      activeHeadingId === heading.id
                                        ? 'ml-0'
                                        : 'ml-3'
                                    }
                                  >
                                    {heading.text}
                                  </span>
                                </div>
                              </motion.button>
                            ))
                          ) : (
                            <div className="text-white/50 text-center py-4 text-sm">
                              No headings found on this page
                            </div>
                          )}
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {/* Show drag indicator when dragging */}
            {isDragging && (
              <motion.div
                className="w-full h-full flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Move className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </motion.div>
        </LayoutGroup>
      </div>
    </DynamicIslandTOCContext.Provider>
  );
}

// Heading subcomponent
function Heading({ children, id: propId }: HeadingProps) {
  const { registerHeading } = useDynamicIslandTOC();
  const headingRef = useRef<HTMLHeadingElement>(null);

  const headingIdFromReactHooks = useId();
  const headingId = propId || headingIdFromReactHooks;
  const registeredRef = useRef(false);

  useEffect(() => {
    // Only register once to prevent infinite loops
    if (headingRef.current && !registeredRef.current) {
      registerHeading(
        headingId,
        headingRef.current?.textContent || '',
        headingRef.current
      );
      registeredRef.current = true;
    }
  }, [headingId, children, registerHeading]);

  return (
    <Primitive.div
      asChild
      ref={headingRef}
      id={headingId}
      className="scroll-mt-16" // Add scroll margin to ensure heading is visible when scrolled to
    >
      {children}
    </Primitive.div>
  );
}

// Compose the component
const DynamicIslandTOC = Object.assign(DynamicIslandTOCRoot, {
  Heading,
});

export { DynamicIslandTOC };
