/**
 * Jura Tempest Federation - Advanced Animation Manager
 * Powered by GSAP (GreenSock) & ScrollTrigger
 * 
 * Provides dynamic card staggers, ScrollTrigger scroll reveals,
 * spring modal animations, stat count-ups, and magnetic hover micro-interactions.
 * Includes graceful fallbacks for environments without GSAP or when reduced motion is preferred.
 */

class AnimationManager {
  constructor() {
    this.isGSAPAvailable = typeof window.gsap !== "undefined";
    this.isScrollTriggerAvailable = typeof window.ScrollTrigger !== "undefined";
    this.prefersReducedMotion = false;

    this.checkReducedMotion();
    this.initGSAP();
  }

  /**
   * Check if user prefers reduced motion for accessibility.
   */
  checkReducedMotion() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.prefersReducedMotion = true;
    }
  }

  /**
   * Initialize GSAP plugins if available.
   */
  initGSAP() {
    if (this.isGSAPAvailable && this.isScrollTriggerAvailable) {
      try {
        window.gsap.registerPlugin(window.ScrollTrigger);
      } catch (err) {
        console.warn("GSAP ScrollTrigger registration skipped:", err);
      }
    }
  }

  /**
   * Staggered card entrance animation.
   * @param {string|NodeList|Array|Element} targets - Selector or elements to animate.
   * @param {Object} options - Custom animation options.
   */
  animateCardStagger(targets, options = {}) {
    const elements = this.resolveElements(targets);
    if (!elements || elements.length === 0) return;

    if (this.prefersReducedMotion || !this.isGSAPAvailable) {
      // Fallback: Make all elements visible immediately
      elements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const defaults = {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 0.5,
      stagger: 0.05,
      ease: "power2.out",
      clearProps: "transform,opacity",
    };

    const config = { ...defaults, ...options };

    // Reset initial state then animate
    window.gsap.killTweensOf(elements);
    window.gsap.fromTo(
      elements,
      { opacity: config.opacity, y: config.y, scale: config.scale },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
        clearProps: config.clearProps,
        onComplete: options.onComplete,
      }
    );
  }

  /**
   * ScrollTrigger-based entrance animation for scrollable elements.
   * @param {string|NodeList|Array|Element} targets - Elements to animate on scroll.
   * @param {Object} options - Custom options.
   */
  animateScrollReveal(targets, options = {}) {
    const elements = this.resolveElements(targets);
    if (!elements || elements.length === 0) return;

    if (this.prefersReducedMotion || !this.isGSAPAvailable || !this.isScrollTriggerAvailable) {
      // Fallback using IntersectionObserver
      this.fallbackScrollReveal(elements);
      return;
    }

    elements.forEach((el) => {
      // Avoid duplicate triggers
      if (el.dataset.gsapRevealed === "true") return;

      const yOffset = options.y || 40;
      const duration = options.duration || 0.6;
      const stagger = options.stagger || 0;

      window.gsap.fromTo(
        el,
        { opacity: 0, y: yOffset },
        {
          opacity: 1,
          y: 0,
          duration: duration,
          stagger: stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: options.start || "top 88%",
            toggleActions: options.toggleActions || "play none none none",
            once: true,
          },
          onComplete: () => {
            el.dataset.gsapRevealed = "true";
            el.style.transform = "none";
          },
        }
      );
    });
  }

  /**
   * IntersectionObserver fallback for scroll reveals when GSAP is absent.
   */
  fallbackScrollReveal(elements) {
    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "none";
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    elements.forEach((el) => observer.observe(el));
  }

  /**
   * Animated modal pop-in with spring physics and backdrop blur fade.
   * @param {Element} modalElement - Outer modal overlay container.
   * @param {Element} contentElement - Inner modal dialog box.
   */
  animateModalOpen(modalElement, contentElement) {
    if (!modalElement) return;

    modalElement.style.display = "flex";

    if (this.prefersReducedMotion || !this.isGSAPAvailable) {
      modalElement.style.opacity = "1";
      if (contentElement) {
        contentElement.style.opacity = "1";
        contentElement.style.transform = "none";
      }
      return;
    }

    const modalContent = contentElement || modalElement.querySelector(".modal-content, .modal-body");

    // Fade backdrop
    window.gsap.killTweensOf([modalElement, modalContent]);
    window.gsap.fromTo(
      modalElement,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );

    // Spring content scale-in
    if (modalContent) {
      window.gsap.fromTo(
        modalContent,
        { opacity: 0, scale: 0.82, y: 25 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: "back.out(1.4)",
          clearProps: "transform",
        }
      );
    }
  }

  /**
   * Animated modal close transition.
   * @param {Element} modalElement - Outer modal overlay.
   * @param {Element} contentElement - Inner modal dialog box.
   * @param {Function} onComplete - Callback executed after animation finishes.
   */
  animateModalClose(modalElement, contentElement, onComplete) {
    if (!modalElement) {
      if (onComplete) onComplete();
      return;
    }

    if (this.prefersReducedMotion || !this.isGSAPAvailable) {
      modalElement.style.display = "none";
      if (onComplete) onComplete();
      return;
    }

    const modalContent = contentElement || modalElement.querySelector(".modal-content, .modal-body");

    if (modalContent) {
      window.gsap.to(modalContent, {
        opacity: 0,
        scale: 0.9,
        y: 15,
        duration: 0.2,
        ease: "power2.in",
      });
    }

    window.gsap.to(modalElement, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        modalElement.style.display = "none";
        if (onComplete) onComplete();
      },
    });
  }

  /**
   * Count-up number animation for statistics counters.
   * @param {Element|string} target - DOM element or selector containing number.
   * @param {number} endValue - Final target number.
   * @param {number} duration - Duration in seconds.
   */
  animateStatCounter(target, endValue, duration = 1.2) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    if (!element) return;

    const startVal = parseInt(element.textContent.replace(/,/g, ""), 10) || 0;
    const finalVal = parseInt(endValue, 10);

    if (isNaN(finalVal)) return;

    if (this.prefersReducedMotion || !this.isGSAPAvailable) {
      element.textContent = finalVal.toLocaleString();
      return;
    }

    const counterObj = { val: startVal };
    window.gsap.to(counterObj, {
      val: finalVal,
      duration: duration,
      ease: "power1.out",
      onUpdate: () => {
        element.textContent = Math.floor(counterObj.val).toLocaleString();
      },
      onComplete: () => {
        element.textContent = finalVal.toLocaleString();
      },
    });
  }

  /**
   * Magnetic hover micro-interaction for interactive buttons and cards.
   * Elements follow the mouse cursor slightly when hovered.
   * @param {string|NodeList|Array} targets - Selectors or elements.
   * @param {number} strength - Pull intensity (default 0.25).
   */
  enableMagneticHover(targets, strength = 0.25) {
    const elements = this.resolveElements(targets);
    if (!elements || elements.length === 0 || this.prefersReducedMotion || !this.isGSAPAvailable) {
      return;
    }

    elements.forEach((el) => {
      if (el.dataset.magneticInit === "true") return;
      el.dataset.magneticInit = "true";

      const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = (e.clientX - centerX) * strength;
        const deltaY = (e.clientY - centerY) * strength;

        window.gsap.to(el, {
          x: deltaX,
          y: deltaY,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = () => {
        window.gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: "elastic.out(1, 0.4)",
        });
      };

      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);
    });
  }

  /**
   * Helper utility to resolve element inputs into an array of DOM Elements.
   */
  resolveElements(targets) {
    if (!targets) return [];
    if (typeof targets === "string") {
      return Array.from(document.querySelectorAll(targets));
    }
    if (targets instanceof Element) {
      return [targets];
    }
    if (targets instanceof NodeList || Array.isArray(targets)) {
      return Array.from(targets);
    }
    return [];
  }
}

// Global Singleton Instance
window.TempestAnimations = new AnimationManager();

// Automatically initialize magnetic hover effects on interactive elements after DOM loads
document.addEventListener("DOMContentLoaded", () => {
  if (window.TempestAnimations) {
    window.TempestAnimations.enableMagneticHover(
      ".filter-tab, .clear-filters-btn, .view-profile-button, .view-details-button, .expand-all-btn, .collapse-all-btn, .view-btn, .search-btn"
    );
  }
});

// Module Export for Vitest / Node testing environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AnimationManager };
}
