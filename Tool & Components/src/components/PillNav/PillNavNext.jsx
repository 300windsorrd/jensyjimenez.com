/*
	Modified from https://reactbits.dev/default/ for Next.js compatibility
*/

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { gsap } from "gsap";
import { useBackground } from '@/contexts/BackgroundContext';
import "./PillNav.css";

/**
 * @typedef {Object} PillNavItem
 * @property {string} href
 * @property {string} label
 * @property {string} [ariaLabel]
 */

/**
 * @typedef {Object} PillNavProps
 * @property {string} logo
 * @property {string} [logoAlt]
 * @property {PillNavItem[]} items
 * @property {string} activeHref
 * @property {string} [className]
 * @property {string} [ease]
 * @property {string} [baseColor]
 * @property {string} [pillColor]
 * @property {string} [hoveredPillTextColor]
 * @property {string} [pillTextColor]
 * @property {string} [logoHref]
 * @property {() => void} [onMobileMenuClick]
 * @property {boolean} [initialLoadAnimation]
 * @property {import('react').ReactNode} [rightListItem]
 * @property {import('react').ReactNode} [slotItem]
 * @property {number|null} [slotIndex]
 * @property {import('react').ReactNode} [slotAfterNode]
 * @property {import('react').ReactNode} [rightSlot]
 * @property {import('react').ReactNode} [leftSlot]
 * @property {boolean} [sticky]
 * @property {number} [topOffset]
 */

/** @param {PillNavProps} props */
const PillNav = ({
  logo,
  logoAlt = "Logo",
  items,
  activeHref,
  className = "",
  ease = "power3.easeOut",
  baseColor = "#fff",
  pillColor = "#060010",
  hoveredPillTextColor = "#060010",
  pillTextColor,
  logoHref,
  onMobileMenuClick,
  initialLoadAnimation = true,
  rightListItem = null,
  slotItem,
  slotIndex,
  slotAfterNode = null,
  rightSlot,
  leftSlot,
  sticky = true,
  topOffset = 14,
}) => {
  const { getButtonColor } = useBackground();
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const logoImgRef = useRef(null);
  const logoTweenRef = useRef(null);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileListRef = useRef(null);
  const navItemsRef = useRef(null);
  const logoRef = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector(".pill-label");
        const white = pill.querySelector(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
          0,
        );

        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: "auto" },
            0,
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
            0,
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: "hidden", opacity: 0, scaleY: 1 });
    }

    if (initialLoadAnimation) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: 0.6,
          ease,
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: "hidden" });
        gsap.to(navItems, {
          width: "auto",
          duration: 0.6,
          ease,
        });
      }
    }

    return () => window.removeEventListener("resize", onResize);
  }, [items, ease, initialLoadAnimation]);

  useEffect(() => {
    setIsMounted(true);
    
    // Detect mobile viewport
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Lock/unlock body scroll when pill mobile menu opens/closes
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;
    const previousOverflow = body.style.overflow;
    if (isMobileMenuOpen) {
      body.style.overflow = 'hidden';
    }
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [isMobileMenuOpen]);

  // Close menu on route changes to avoid persistent scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      forceCloseMobileMenu();
    }
  }, [activeHref]);

  // Ensure hamburger animation resets whenever menu closes (e.g., link click or route change)
  useEffect(() => {
    if (isMobileMenuOpen) return;
    const hamburger = hamburgerRef.current;
    if (!hamburger) return;
    const lines = hamburger.querySelectorAll('.hamburger-line');
    if (!lines || lines.length < 2) return;
    gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
    gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
  }, [isMobileMenuOpen]);

  // Add click outside handler to close mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen || !isMounted) return;

    const handleClickOutside = (event) => {
      const hamburger = hamburgerRef.current;
      const menu = mobileMenuRef.current;
      
      // Don't close if clicking on the hamburger button itself
      if (hamburger && hamburger.contains(event.target)) {
        return;
      }
      
      // Don't close if clicking inside the mobile menu
      if (menu && menu.contains(event.target)) {
        return;
      }
      
      // Close the menu if clicking outside
      setIsMobileMenuOpen(false);
    };

    // Use a small delay to prevent immediate closure from the same click that opened the menu
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClickOutside, { passive: true });
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen, isMounted]);

  // Add escape key handler to close mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen || !isMounted) return;

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen, isMounted]);

  // Handle clicks on background customization elements that should close the mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen || !isMounted) return;

    const handleBackgroundCustomizationClick = (event) => {
      // Check if the click is on a background customization element
      const target = event.target;
      const isBackgroundButton = target.closest('[data-background-customization]') ||
                                target.closest('.background-slider') ||
                                target.closest('[data-background]') ||
                                target.closest('.style-selector') ||
                                target.closest('.theme-toggle');
      
      if (isBackgroundButton) {
        // Close the mobile menu when background customization is clicked
        forceCloseMobileMenu();
      }
    };

    // Use a small delay to ensure the event listener is added after the current click event
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleBackgroundCustomizationClick, { passive: true });
    }, 50);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleBackgroundCustomizationClick);
    };
  }, [isMobileMenuOpen, isMounted]);

  // Force close mobile menu function for external use
  const forceCloseMobileMenu = () => {
    if (!isMobileMenuOpen) return;
    
    setIsMobileMenuOpen(false);
    
    // Reset hamburger button state
    const hamburger = hamburgerRef.current;
    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (lines && lines.length >= 2) {
        gsap.killTweensOf(lines[0]);
        gsap.killTweensOf(lines[1]);
        gsap.set(lines[0], { rotation: 0, y: 0 });
        gsap.set(lines[1], { rotation: 0, y: 0 });
      }
    }
    
    // Reset menu state
    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.killTweensOf(menu);
      gsap.set(menu, { visibility: "hidden", opacity: 0, scale: 0.96 });
    }
  };

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    
    // Prevent rapid toggling that could cause state inconsistencies
    if (newState && isMobileMenuOpen) return;
    if (!newState && !isMobileMenuOpen) return;
    
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;
    const list = mobileListRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll(".hamburger-line");
      if (!lines || lines.length < 2) return;
      
      // Kill any existing animations to prevent conflicts
      gsap.killTweensOf(lines[0]);
      gsap.killTweensOf(lines[1]);
      
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease, overwrite: "auto" });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease, overwrite: "auto" });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease, overwrite: "auto" });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease, overwrite: "auto" });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: "visible", scale: 0.9, opacity: 0, transformOrigin: "center center" });
        gsap.to(menu, { opacity: 1, scale: 1, duration: 0.22, ease, overwrite: "auto" });

        // Animate links from center out
        if (list) {
          const links = list.querySelectorAll(".pill-mobile-link");
          if (links && links.length) {
            gsap.set(links, { opacity: 0, y: 8, scale: 0.96 });
            const centerIndex = Math.floor(links.length / 2);
            links.forEach((el, i) => {
              gsap.to(el, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.24,
                ease,
                delay: Math.abs(i - centerIndex) * 0.045,
                overwrite: "auto",
              });
            });
          }
        }
      } else {
        // Animate links center-out on close, then fade the menu
        if (list) {
          const links = list.querySelectorAll(".pill-mobile-link");
          if (links && links.length) {
            const centerIndex = Math.floor(links.length / 2);
            links.forEach((el, i) => {
              gsap.to(el, {
                opacity: 0,
                y: 8,
                scale: 0.96,
                duration: 0.16,
                ease,
                delay: Math.abs(i - centerIndex) * 0.03,
                overwrite: "auto",
              });
            });
          }
        }
        gsap.to(menu, {
          opacity: 0,
          scale: 0.96,
          duration: 0.18,
          ease,
          transformOrigin: "center center",
          onComplete: () => {
            gsap.set(menu, { visibility: "hidden" });
          },
        });
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = (href) =>
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("//") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:") ||
    href.startsWith("#");

  const isRouterLink = (href) => href && !isExternalLink(href);

  const cssVars = {
    ["--base"]: baseColor,
    ["--pill-bg"]: pillColor,
    ["--hover-text"]: hoveredPillTextColor,
    ["--pill-text"]: resolvedPillTextColor,
  };

  const containerStyle = sticky
    ? { 
        position: 'fixed',
        top: `${topOffset}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 'var(--z-nav)',
        width: 'max-content'
      }
    : { 
        position: 'static', 
        top: 'auto', 
        left: 'auto', 
        transform: 'none', 
        margin: '0 auto', 
        width: 'max-content', 
        marginTop: `${topOffset}px` 
      }

  return (
    <div className={`pill-nav-container${isMobileMenuOpen ? " menu-open" : ""}`} style={containerStyle}>
      <nav
        className={`pill-nav ${className}`}
        aria-label="Primary navigation"
        style={cssVars}
        role="navigation"
      >
        {/* Logo - Only render on desktop */}
        {!isMobile && (
          <>
            {isRouterLink(logoHref ?? items?.[0]?.href) ? (
              <Link
                className="pill-logo"
                href={(logoHref ?? items[0].href)}
                aria-label="Home - Navigate to homepage"
                onMouseEnter={handleLogoEnter}
                role="menuitem"
                tabIndex={0}
                ref={(el) => {
                  logoRef.current = el;
                }}
              >
                <span className="logo-text">{logo}</span>
              </Link>
            ) : (
              <a
                className="pill-logo"
                href={(logoHref ?? items?.[0]?.href) || "#"}
                aria-label="Home - Navigate to homepage"
                onMouseEnter={handleLogoEnter}
                tabIndex={0}
                ref={(el) => {
                  logoRef.current = el;
                }}
              >
                <span className="logo-text">{logo}</span>
              </a>
            )}
          </>
        )}

        {/* Left Slot - Only render on desktop */}
        {!isMobile && leftSlot ? (
          <div className="pill-left-slot">
            {leftSlot}
          </div>
        ) : null}

        {/* Desktop Navigation - Only render on desktop */}
        {!isMobile && (
          <div className="pill-nav-items desktop-only" ref={navItemsRef}>
            <ul className="pill-list" role="menubar">
              {items.map((item, i) => (
                <li key={item.href || `item-${i}`} role="none">
                  {typeof slotIndex === 'number' && i === slotIndex && slotItem ? (
                    <>
                      <div role="none" style={{ display: 'inline-block' }}>
                        {slotItem}
                      </div>
                      {slotAfterNode ? (
                        <div role="none" className="pill-selector-inline" style={{ display: 'inline-block' }}>
                          {slotAfterNode}
                        </div>
                      ) : null}
                    </>
                  ) : null}
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      href={item.href}
                      className={`pill${activeHref === item.href ? " is-active" : ""}`}
                      aria-label={item.ariaLabel || item.label}
                      aria-current={activeHref === item.href ? "page" : undefined}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      tabIndex={0}
                      style={activeHref === item.href ? { 
                        backgroundColor: getButtonColor(),
                        color: '#ffffff'
                      } : {}}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover" aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={`pill${activeHref === item.href ? " is-active" : ""}`}
                      aria-label={item.ariaLabel || item.label}
                      aria-current={activeHref === item.href ? "page" : undefined}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                      tabIndex={0}
                      style={activeHref === item.href ? { 
                        backgroundColor: getButtonColor(),
                        color: '#ffffff'
                      } : {}}
                    >
                      <span
                        className="hover-circle"
                        aria-hidden="true"
                        ref={(el) => {
                          circleRefs.current[i] = el;
                        }}
                      />
                      <span className="label-stack">
                        <span className="pill-label">{item.label}</span>
                        <span className="pill-label-hover" aria-hidden="true">
                          {item.label}
                        </span>
                      </span>
                    </a>
                  )}
                </li>
              ))}
              {rightListItem ? (
                <li role="none">
                  {rightListItem}
                </li>
              ) : null}
            </ul>
          </div>
        )}

        {/* Right Slot - Only render on desktop */}
        {!isMobile && rightSlot}

        {/* Mobile Navigation - Only render on mobile */}
        {isMobile && (
          <div className="pill-nav-mobile">
            <button
              className="pill-hamburger"
              onClick={toggleMobileMenu}
              aria-expanded={isMobileMenuOpen}
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-controls="mobile-navigation-menu"
              tabIndex={0}
              ref={hamburgerRef}
            >
              <div className="hamburger-line" />
              <div className="hamburger-line" />
            </button>

            {isMounted && createPortal(
              <div
                className="pill-mobile-menu"
                ref={mobileMenuRef}
                aria-hidden={!isMobileMenuOpen}
                id="mobile-navigation-menu"
                role="menu"
                style={cssVars}
              >
                <ul className="pill-mobile-list" ref={mobileListRef}>
                  {items.map((item, i) => (
                    <li key={item.href || `mobile-item-${i}`} role="none">
                      {isRouterLink(item.href) ? (
                        <Link
                          href={item.href}
                          className={`pill-mobile-link${
                            activeHref === item.href ? " is-active" : ""
                          }`}
                          aria-label={item.ariaLabel || item.label}
                          aria-current={activeHref === item.href ? "page" : undefined}
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className={`pill-mobile-link${
                            activeHref === item.href ? " is-active" : ""
                          }`}
                          aria-label={item.ariaLabel || item.label}
                          aria-current={activeHref === item.href ? "page" : undefined}
                          role="menuitem"
                          tabIndex={0}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>,
              document.body
            )}
          </div>
        )}
      </nav>
    </div>
  );
};

export default PillNav;
