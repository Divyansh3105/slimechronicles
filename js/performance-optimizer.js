
// Performance optimizer class - Detects device capabilities and applies optimizations
class PerformanceOptimizer {
  constructor() {
    // Detect device performance characteristics for optimization decisions
    this.isLowEndDevice = this.detectLowEndDevice();
    this.isMobile = window.innerWidth <= 768;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Initialize performance optimizations based on device capabilities
    this.init();
  }

  // Detect low-end device - Analyze device capabilities to determine performance level
  detectLowEndDevice() {
    // Check various device performance indicators for comprehensive assessment
    const indicators = {
      lowMemory: navigator.deviceMemory && navigator.deviceMemory < 2,
      lowCores: navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4,
      slowConnection: navigator.connection && navigator.connection.effectiveType &&
                     ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType),
      oldBrowser: !window.IntersectionObserver || !window.requestIdleCallback
    };

    // Count number of low-end indicators present to determine device classification
    const lowEndCount = Object.values(indicators).filter(Boolean).length;
    return lowEndCount >= 2;
  }

  // Initialize performance optimizations - Apply device-specific optimizations
  init() {
    // Apply optimizations for low-end devices to improve performance
    if (this.isLowEndDevice) {
      this.applyLowEndOptimizations();
    }

    // Apply reduced motion optimizations if user prefers accessibility settings
    if (this.prefersReducedMotion) {
      this.applyReducedMotionOptimizations();
    }

    // Start monitoring performance metrics for dynamic optimization
    this.startPerformanceMonitoring();
  }

  // Apply optimizations for low-end devices - Disable resource-intensive visual effects
  applyLowEndOptimizations() {
    const style = document.createElement('style');
    style.textContent = `
      .particles, .starfield, .floating-elements {
        display: none !important;
      }

      .character-background::before,
      .character-background::after {
        display: none !important;
      }

      .magic-circle {
        display: none !important;
      }

      .power-level-circle {
        animation: none !important;
      }

      .profile-image-container {
        animation: none !important;
      }

      .timeline-marker {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // Apply reduced motion optimizations - Respect user accessibility preferences for motion
  applyReducedMotionOptimizations() {
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        .particles, .starfield, .floating-elements {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Start performance monitoring - Monitor FPS and apply emergency optimizations if needed
  startPerformanceMonitoring() {
    if (!window.performance || !window.performance.now) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    // Measure frames per second to detect performance issues
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;

        // Apply emergency optimizations if FPS drops below acceptable threshold
        if (fps < 30 && !this.emergencyOptimizationsApplied) {
          this.applyEmergencyOptimizations();
        }
      }

      requestAnimationFrame(measureFPS);
    };

    // Start monitoring after initial page load to avoid skewing results
    setTimeout(() => {
      requestAnimationFrame(measureFPS);
    }, 2000);
  }

  // Apply emergency optimizations - Disable all animations and effects when performance is critically low
  applyEmergencyOptimizations() {
    this.emergencyOptimizationsApplied = true;

    const style = document.createElement('style');
    style.textContent = `
      * {
        animation: none !important;
        transition: none !important;
      }

      .particles, .starfield, .floating-elements, .magic-circle {
        display: none !important;
      }

      .character-background {
        opacity: 0.2 !important;
      }

      .character-background::before,
      .character-background::after {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Clean up particle systems to free memory and processing power
    if (window.particleSystem) {
      window.particleSystem.cleanup();
    }
  }

  // Check if specific feature should be optimized - Determine optimization needs for individual features
  shouldOptimize(feature) {
    switch (feature) {
      case 'particles':
        return this.isLowEndDevice || (this.isMobile && this.prefersReducedMotion);
      case 'animations':
        return this.prefersReducedMotion || this.isLowEndDevice;
      case 'background-effects':
        return this.isLowEndDevice;
      default:
        return false;
    }
  }
}
// Initialize performance optimizer based on document ready state - Ensure DOM is ready before optimization
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
  });
} else {
  window.performanceOptimizer = new PerformanceOptimizer();
}

// Make PerformanceOptimizer class globally available for external access
window.PerformanceOptimizer = PerformanceOptimizer;
