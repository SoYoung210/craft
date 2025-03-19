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
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

import { cn } from '../../../utils/css';

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

// Main component
function DynamicIslandTOCRoot({ className, children }: DynamicIslandTOCProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeHeadingId, setActiveHeadingId] = useState<string | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingsMapRef = useRef<Map<string, Heading>>(new Map());
  const isInitialRenderRef = useRef(true);
  const contentRef = useRef<HTMLDivElement>(null);

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
    setIsExpanded(!isExpanded);
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
        className={cn(
          'fixed top-0 left-0 right-0 flex justify-center pt-2 z-50',
          className
        )}
      >
        <LayoutGroup>
          <motion.div
            layout
            className={cn(
              'bg-black rounded-[24px] shadow-lg cursor-pointer overflow-hidden',
              isExpanded ? 'w-[340px]' : 'w-[120px]'
            )}
            initial={false}
            animate={{
              width: isExpanded ? 340 : 120,
              height: isExpanded ? 240 : 32,
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            onClick={toggleIsland}
          >
            {/* Notch Content (Always Visible) */}
            <motion.div
              layout="position"
              className="flex items-center justify-between h-8 px-4"
            >
              <motion.div
                layout="position"
                className="flex items-center space-x-2"
              >
                <motion.div
                  layout="position"
                  className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-3 h-3 text-white" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-white" />
                  )}
                </motion.div>
                <motion.div
                  layout="position"
                  className="text-white text-xs font-medium"
                >
                  Index
                </motion.div>
              </motion.div>

              <motion.div
                layout="position"
                className="bg-gray-700 rounded-full px-2 py-0.5 text-xs text-white"
              >
                {readingProgress}%
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
                  {/* TOC Header */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex justify-center mb-4"
                  >
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Table of Contents
                      </span>
                    </div>
                  </motion.div>

                  {/* TOC Content */}
                  <motion.div layout className="h-[152px]">
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
                      className="space-y-1 overflow-y-auto max-h-[152px] pr-2 scrollbar-thin"
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
        typeof children === 'string' ? children : headingId,
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
