'use client';

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, Transition } from "motion/react";
import Image from "next/image";

import "./ImageCarousel.css";

/**
 * CRITICAL IMPLEMENTATION NOTES
 * =============================
 * 
 * ⚠️  PARENT CONTAINER OVERFLOW ISSUE - NEVER FORGET!
 * 
 * Problem: Parent containers with overflow-hidden will clip carousel navigation
 * buttons and indicators, making them partially or completely invisible.
 * 
 * Solution: 
 * 1. Parent containers should NOT have overflow-hidden
 * 2. Use overflow-visible or no overflow property
 * 3. The ImageCarousel handles its own overflow internally
 * 
 * Example of CORRECT usage:
 * - Use a div with className="relative w-full h-full" (no overflow property)
 * - Place ImageCarousel component inside
 * 
 * Example of INCORRECT usage:
 * - Avoid div with className="relative w-full h-full overflow-hidden"
 * - This will clip navigation buttons and indicators
 * 
 * Previous issues encountered:
 * - Right navigation button was clipped off-screen
 * - Only top-left portion of carousel was visible
 * - Indicators were partially hidden
 * 
 * Testing checklist:
 * □ Navigation buttons fully visible on all screen sizes
 * □ Carousel content not clipped by parent containers
 * □ Indicators visible at bottom of carousel
 * □ Responsive behavior works without overflow issues
 */

// Custom hook for responsive carousel behavior
function useResponsiveCarousel(baseWidth: number, baseHeight: number) {
  const [dimensions, setDimensions] = useState({ width: baseWidth, height: baseHeight });
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallMobile, setIsSmallMobile] = useState(false);
  
  useEffect(() => {
    const updateResponsiveness = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsSmallMobile(width <= 480);
    };
    
    updateResponsiveness();
    window.addEventListener('resize', updateResponsiveness);
    
    return () => window.removeEventListener('resize', updateResponsiveness);
  }, []);
  
  return { dimensions, setDimensions, isMobile, isSmallMobile };
}

// Separate component for carousel items to avoid hooks rule violation
function CarouselItem({ 
  image, 
  index, 
  trackItemOffset, 
  itemWidth, 
  baseHeight, 
  x, 
  effectiveTransition 
}: {
  image: CarouselImage;
  index: number;
  trackItemOffset: number;
  itemWidth: number;
  baseHeight: number;
  x: ReturnType<typeof useMotionValue<number>>;
  effectiveTransition: Transition;
}) {
  const [imageError, setImageError] = useState(false);
  
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  const handleImageError = () => {
    setImageError(true);
  };

  return (
         <motion.div
       className="image-carousel-item"
       style={{
         width: itemWidth,
         height: baseHeight || '100%',
         rotateY: rotateY,
       }}
      transition={effectiveTransition}
    >
             <div className="image-carousel-image-container">
         {!imageError ? (
           <Image
             src={image.src}
             alt={image.alt}
             fill
             className="image-carousel-image"
             sizes={`(max-width: 768px) 100vw, ${itemWidth}px`}
             priority={index === 0}
             onError={handleImageError}
             quality={90}
             loading={index < 2 ? 'eager' : 'lazy'}
           />
        ) : (
          <div className="image-carousel-error">
            <div className="error-content">
              <span>⚠️</span>
              <p>Image failed to load</p>
            </div>
          </div>
        )}
        
        {!imageError && (image.title || image.description) && (
          <div className="image-carousel-overlay">
            {image.title && (
              <h3 className="image-carousel-title">{image.title}</h3>
            )}
            {image.description && (
              <p className="image-carousel-description">{image.description}</p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  baseWidth?: number;
  baseHeight?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  showIndicators?: boolean;
  showNavigation?: boolean;
  className?: string;
}

const DRAG_BUFFER = 50;
const VELOCITY_THRESHOLD = 500;
const GAP = 0;
const SPRING_OPTIONS: Transition = { type: "spring", stiffness: 300, damping: 30 };

export function ImageCarousel({
  images,
  baseWidth = 600,
  baseHeight = 400,
  autoplay = true,
  autoplayDelay = 3000,
  pauseOnHover = true,
  loop = true,
  showIndicators = true,
  showNavigation = true,
  className = "",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  
  const { dimensions, setDimensions, isMobile, isSmallMobile } = useResponsiveCarousel(baseWidth, baseHeight);
  
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ensure we have valid images to display
  const validImages = images.filter(img => img.src && img.alt);



  // Preload images for better performance
  useEffect(() => {
    const preloadImage = (src: string) => {
      if (preloadedImages.has(src)) return;
      
      const img = new window.Image();
      img.onload = () => {
        setPreloadedImages(prev => new Set([...prev, src]));
      };
      img.src = src;
    };

    // Preload current and next few images
    const imagesToPreload = validImages.slice(currentIndex, Math.min(currentIndex + 3, validImages.length));
    imagesToPreload.forEach(img => preloadImage(img.src));
  }, [currentIndex, validImages, preloadedImages]);

  // Responsive sizing logic
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Use the full container dimensions to ensure proper fit
        setDimensions({ width: containerWidth, height: containerHeight });
      }
    };

    // Initial update
    updateDimensions();
    
    // Update on resize
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    // Fallback for older browsers
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, [setDimensions]);

  // Additional effect to handle viewport changes
  useEffect(() => {
    const handleViewportChange = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        
        // Use the full container dimensions to ensure proper fit
        setDimensions({ width: containerWidth, height: containerHeight });
      }
    };

    // Listen for orientation changes and other viewport events
    window.addEventListener('orientationchange', handleViewportChange);
    window.addEventListener('resize', handleViewportChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleViewportChange);
      window.removeEventListener('resize', handleViewportChange);
    };
  }, [setDimensions]);

  const carouselImages = loop ? [...validImages, validImages[0]] : validImages;
  const itemWidth = dimensions.width || baseWidth;
  const trackItemOffset = itemWidth + GAP;

  // Handle autoplay
  useEffect(() => {
    if (autoplay && (!pauseOnHover || !isHovered)) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev === validImages.length - 1 && loop) {
            return prev + 1;
          }
          if (prev === carouselImages.length - 1) {
            return loop ? 0 : prev;
          }
          return prev + 1;
        });
      }, autoplayDelay);
      return () => clearInterval(timer);
    }
  }, [autoplay, autoplayDelay, isHovered, loop, validImages.length, carouselImages.length, pauseOnHover]);

  // Handle pause on hover
  useEffect(() => {
    if (pauseOnHover) {
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      
      const container = containerRef.current;
      if (container) {
        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
        
        return () => {
          container.removeEventListener('mouseenter', handleMouseEnter);
          container.removeEventListener('mouseleave', handleMouseLeave);
        };
      }
    }
  }, [pauseOnHover]);



  // Check if we have valid images to display
  if (validImages.length === 0) {
    return (
      <div className={`image-carousel-container ${className}`} ref={containerRef}>
        <div className="image-carousel-error">
          <div className="error-content">
            <span>📷</span>
            <p>No images available</p>
          </div>
        </div>
      </div>
    );
  }

  const effectiveTransition = isResetting ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationComplete = () => {
    if (loop && currentIndex === carouselImages.length - 1) {
      setIsResetting(true);
      x.set(0);
      setCurrentIndex(0);
      setTimeout(() => setIsResetting(false), 50);
    }
  };

  const handleDragEnd = (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
      if (loop && currentIndex === validImages.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setCurrentIndex((prev) => Math.min(prev + 1, validImages.length - 1));
      }
    } else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
      if (loop && currentIndex === 0) {
        setCurrentIndex(validImages.length - 1);
      } else {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => {
      if (prev === 0 && loop) {
        return validImages.length - 1;
      }
      return Math.max(prev - 1, 0);
    });
  };

  const goToNext = () => {
    setCurrentIndex((prev) => {
      if (prev === validImages.length - 1 && loop) {
        return 0;
      }
      return Math.min(prev + 1, validImages.length - 1);
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * (validImages.length - 1),
          right: 0,
        },
      };

  // Calculate dynamic positioning values for CSS custom properties
  const buttonPosition = isSmallMobile ? 8 : isMobile ? 12 : 16;
  const buttonSize = isSmallMobile ? 32 : isMobile ? 36 : 44;
  const iconSize = isSmallMobile ? 14 : isMobile ? 16 : 20;

  return (
    <div
      ref={containerRef}
      className={`image-carousel-container ${className}`}
      style={{
        width: '100%',
        height: '100%',
        '--button-position': `${buttonPosition}px`,
        '--button-size': `${buttonSize}px`,
        '--icon-size': `${iconSize}px`,
        '--max-width': `${baseWidth}px`,
        '--max-height': `${baseHeight}px`,
      } as React.CSSProperties}
    >
      
             <motion.div
         className="image-carousel-track"
         drag="x"
         {...dragProps}
         style={{
           width: `${carouselImages.length * itemWidth}px`,
           gap: `${GAP}px`,
           x,
         }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(currentIndex * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationComplete={handleAnimationComplete}
      >
        {carouselImages.map((image, index) => (
          <CarouselItem
            key={index}
            image={image}
            index={index}
            trackItemOffset={trackItemOffset}
            itemWidth={itemWidth}
            baseHeight={baseHeight}
            x={x}
            effectiveTransition={effectiveTransition}
          />
        ))}
      </motion.div>

      {/* Navigation Arrows */}
      {showNavigation && (
        <>
          <button
            className="image-carousel-nav image-carousel-nav-prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="image-carousel-nav image-carousel-nav-next"
            onClick={goToNext}
            aria-label="Next image"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && (
        <div className="image-carousel-indicators">
          {validImages.map((_, index) => (
            <motion.button
              key={index}
              className={`image-carousel-indicator ${
                currentIndex % validImages.length === index ? "active" : "inactive"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to image ${index + 1}`}
              animate={{
                scale: currentIndex % validImages.length === index ? 1.2 : 1,
              }}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
