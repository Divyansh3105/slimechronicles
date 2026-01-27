
class PerformanceOptimizer {
  constructor() {
    this.isLowEndDevice = this.detectLowEndDevice();
    this.isMobile = window.innerWidth <= 768;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  detectLowEndDevice() {

    const indicators = {
      lowMemory: navigator.deviceMemory && navigator.deviceMemory < 2,
      lowCores: navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4,
      slowConnection: navigator.connection && navigator.connection.effectiveType &&
                     ['slow-2g', '2g', '3g'].includes(navigator.connection.effectiveType),
      oldBrowser: !window.IntersectionObserver || !window.requestIdleCallback
    };


    const lowEndCount = Object.values(indicators).filter(Boolean).length;
    return lowEndCount >= 2;
  }

  init() {
    if (this.isLowEndDevice) {
      this.applyLowEndOptimizations();
    }

    if (this.isMobile) {
      this.applyMobileOptimizations();
    }

    if (this.prefersReducedMotion) {
      this.applyReducedMotionOptimizations();
    }


    this.startPerformanceMonitoring();
  }

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

  applyMobileOptimizations() {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        .character-background::before,
        .character-background::after {
          animation-duration: 60s !important;
        }

        .floating-elements {
          opacity: 0.3 !important;
        }

        .particles {
          opacity: 0.4 !important;
        }

        .starfield {
          opacity: 0.5 !important;
        }


        .info-card:hover,
        .skill-card-detailed:hover,
        .relationship-category:hover {
          transform: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

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

  startPerformanceMonitoring() {
    if (!window.performance || !window.performance.now) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let fps = 60;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;


        if (fps < 30 && !this.emergencyOptimizationsApplied) {
          this.applyEmergencyOptimizations();
        }
      }

      requestAnimationFrame(measureFPS);
    };

    setTimeout(() => {
      requestAnimationFrame(measureFPS);
    }, 2000);
  }

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


    if (window.particleSystem) {
      window.particleSystem.cleanup();
    }
  }


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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.performanceOptimizer = new PerformanceOptimizer();
  });
} else {
  window.performanceOptimizer = new PerformanceOptimizer();
}
window.PerformanceOptimizer = PerformanceOptimizer;
