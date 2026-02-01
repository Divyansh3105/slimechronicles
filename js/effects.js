// Animated background class - Manages particle effects and background animations
class AnimatedBackground {
  constructor(options = {}) {
    // Initialize configuration options with default fallback values
    this.options = {
      baseImageUrl: "assets/bg.jpg",
      enableAnimation: true,
      ...options,
    };

    // Store reference to particles.js instance for lifecycle management
    this.particlesInstance = null;
    this.init();
  }

  // Initialize animated background system - Set up base background and load particles
  init() {
    this.setupBaseBackground();

    // Conditionally load particle animations based on configuration
    if (this.options.enableAnimation) {
      this.loadParticlesJS();
    }
  }

  // Configure base background image with overlay gradient for visual depth
  setupBaseBackground() {
    const body = document.body;
    const backgroundStyle = `
      linear-gradient(rgba(10, 14, 39, 0.7), rgba(10, 14, 39, 0.7)),
      url('${this.options.baseImageUrl}')
    `;

    // Apply background styles with important priority to override existing styles
    body.style.setProperty("background", backgroundStyle, "important");
    body.style.setProperty("background-size", "cover", "important");
    body.style.setProperty("background-attachment", "fixed", "important");
    body.style.setProperty("background-position", "center", "important");
    body.style.setProperty("background-repeat", "no-repeat", "important");
  }

  // Asynchronously load particles.js library and initialize particle system
  async loadParticlesJS() {
    try {
      // Check if particles.js is already loaded to avoid duplicate loading
      if (typeof particlesJS === "undefined") {
        await this.loadScript(
          "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js",
        );
      }

      this.createParticlesContainer();
      this.initializeParticles();
    } catch (error) {
      console.log(
        "Failed to load particles.js, using base background only:",
        error,
      );
    }
  }

  // Dynamically load external JavaScript library with promise-based handling
  loadScript(src) {
    return new Promise((resolve, reject) => {
      // Prevent duplicate script loading by checking existing script tags
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      // Create and configure script element for dynamic loading
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Create DOM container element for particles.js canvas rendering
  createParticlesContainer() {
    // Remove existing particles container to prevent conflicts
    const existing = document.getElementById("particles-js");
    if (existing) {
      existing.remove();
    }

    // Create new particles container with fixed positioning and styling
    const particlesContainer = document.createElement("div");
    particlesContainer.id = "particles-js";
    particlesContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    `;

    // Insert particles container as first child for proper layering
    document.body.insertBefore(particlesContainer, document.body.firstChild);
  }

  // Initialize particles.js with comprehensive configuration for visual effects
  initializeParticles() {
    const particlesConfig = {
      particles: {
        number: {
          value: 80, // Total number of particles to render
          density: {
            enable: true,
            value_area: 800, // Particle density per area unit
          },
        },
        color: {
          value: ["#4dd4ff", "#8a2be2", "#ffd700", "#00bfff"], // Multi-color particle palette
        },
        shape: {
          type: "circle", // Circular particle shape for consistent appearance
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5, // Base opacity for particle visibility
          random: false,
          anim: {
            enable: true, // Enable opacity animation for dynamic effect
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3, // Base particle size in pixels
          random: true, // Enable random size variation
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true, // Enable particle connection lines
          distance: 150, // Maximum distance for line connections
          color: "#4dd4ff",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true, // Enable particle movement animation
          speed: 2, // Movement speed for smooth animation
          direction: "none", // Random movement direction
          random: false,
          straight: false,
          out_mode: "out", // Particle behavior when leaving canvas
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas", // Mouse interaction detection area
        events: {
          onhover: {
            enable: true, // Enable hover interaction effects
            mode: "repulse",
          },
          onclick: {
            enable: true, // Enable click interaction effects
            mode: "push",
          },
          resize: true, // Handle window resize events
        },
        modes: {
          grab: {
            distance: 140, // Grab interaction distance
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400, // Bubble effect trigger distance
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 100, // Repulse effect distance
            duration: 0.4,
          },
          push: {
            particles_nb: 4, // Number of particles to add on click
          },
          remove: {
            particles_nb: 2, // Number of particles to remove
          },
        },
      },
      retina_detect: true, // Enable high-DPI display support
    };

    // Initialize particles.js with configuration
    particlesJS("particles-js", particlesConfig);

    // Store instance reference for cleanup and management
    this.particlesInstance = window.pJSDom && window.pJSDom[0];
  }

  // Clean up particles.js instance and remove DOM elements
  destroy() {
    // Properly destroy particles.js instance to prevent memory leaks
    if (this.particlesInstance && this.particlesInstance.pJS) {
      this.particlesInstance.pJS.fn.vendors.destroypJS();
      this.particlesInstance = null;
    }

    // Remove particles container from DOM
    const container = document.getElementById("particles-js");
    if (container) {
      container.remove();
    }
  }

  // Enable particle animations by loading particles.js system
  enableAnimation() {
    this.options.enableAnimation = true;
    if (!this.particlesInstance) {
      this.loadParticlesJS();
    }
  }

  // Disable particle animations and clean up resources
  disableAnimation() {
    this.destroy();
    this.options.enableAnimation = false;
  }
}

// Optimized particle system with object pooling for performance and memory efficiency
class ParticleSystem {
  constructor() {
    // Object pools for reusing DOM elements to reduce garbage collection
    this.particlePool = [];
    this.starPool = [];
    // Active element tracking arrays for lifecycle management
    this.activeParticles = [];
    this.activeStars = [];
    // Performance-optimized particle counts based on device capabilities
    this.maxParticles = this.getOptimalParticleCount();
    this.maxStars = Math.floor(this.maxParticles * 1.2);
    // Color palette for particle visual variety
    this.colors = ["blue", "cyan", "purple", "gold"];
  }

  // Calculate optimal particle count based on device performance and user preferences
  getOptimalParticleCount() {
    let count = 15; // Base particle count for desktop devices

    // Reduce particle count for mobile devices to maintain performance
    if (
      window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768
    ) {
      count = 8;
    }

    // Further reduction for small mobile screens
    if (window.innerWidth < 480) {
      count = 5;
    }

    // Adjust for devices with limited CPU cores
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      count = Math.floor(count * 0.6);
    }

    // Respect user's reduced motion preference for accessibility
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      count = Math.floor(count * 0.3);
    }

    // Disable particles on low-memory devices to prevent crashes
    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
      count = 0;
    }

    return Math.max(count, 0);
  }

  // Create optimized particle DOM element with hardware acceleration
  createParticleElement() {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Enable hardware acceleration for smooth animations
    particle.style.willChange = "transform";
    particle.style.transform = "translate3d(0, 0, 0)";
    return particle;
  }

  // Create optimized star DOM element with hardware acceleration
  createStarElement() {
    const star = document.createElement("div");
    star.className = "star";

    // Enable hardware acceleration for smooth animations
    star.style.willChange = "transform";
    star.style.transform = "translate3d(0, 0, 0)";
    return star;
  }

  // Retrieve particle from object pool or create new one if pool is empty
  getParticle() {
    return this.particlePool.pop() || this.createParticleElement();
  }

  // Retrieve star from object pool or create new one if pool is empty
  getStar() {
    return this.starPool.pop() || this.createStarElement();
  }

  // Return particle to object pool for reuse to reduce memory allocation
  releaseParticle(particle) {
    particle.style.display = "none";
    this.particlePool.push(particle);
  }

  // Return star to object pool for reuse to reduce memory allocation
  releaseStar(star) {
    star.style.display = "none";
    this.starPool.push(star);
  }

  // Initialize particle system with random positioning and animation properties
  initializeParticles() {
    const container = document.getElementById("particles");
    if (!container) return;

    // Clean up existing particles before creating new ones
    this.cleanup();

    // Create and configure particles with random properties
    for (let i = 0; i < this.maxParticles; i++) {
      const particle = this.getParticle();

      // Apply random color class from predefined palette
      const colorClass =
        this.colors[Math.floor(Math.random() * this.colors.length)];
      particle.className = `particle ${colorClass}`;

      // Set random initial position using viewport units for responsiveness
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      particle.style.transform = `translate3d(${x}vw, ${y}vh, 0)`;

      // Randomize animation timing for natural movement patterns
      particle.style.animationDelay = Math.random() * 10 + "s";
      particle.style.animationDuration = 10 + Math.random() * 10 + "s";

      // Apply random size variation for visual diversity
      const size = 2 + Math.random() * 3;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.display = "block";

      // Add to DOM and track in active particles array
      container.appendChild(particle);
      this.activeParticles.push(particle);
    }
  }

  // Initialize starfield background with twinkling animation effects
  initializeStars() {
    const starfield = document.getElementById("starfield");
    if (!starfield) return;

    // Create stars with random positioning and animation properties
    for (let i = 0; i < this.maxStars; i++) {
      const star = this.getStar();

      // Set random position across viewport
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      star.style.transform = `translate3d(${x}vw, ${y}vh, 0)`;

      // Apply random size for star variety
      const size = 1 + Math.random() * 2;
      star.style.width = size + "px";
      star.style.height = size + "px";

      // Randomize twinkling animation timing
      star.style.animationDuration = 2 + Math.random() * 4 + "s";
      star.style.animationDelay = Math.random() * 5 + "s";
      star.style.display = "block";

      // Add to DOM and track in active stars array
      starfield.appendChild(star);
      this.activeStars.push(star);
    }
  }

  // Clean up all active particles and stars, returning them to object pools
  cleanup() {
    // Remove particles from DOM and return to pool
    this.activeParticles.forEach((particle) => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
      this.releaseParticle(particle);
    });

    // Remove stars from DOM and return to pool
    this.activeStars.forEach((star) => {
      if (star.parentNode) {
        star.parentNode.removeChild(star);
      }
      this.releaseStar(star);
    });

    // Clear active element tracking arrays
    this.activeParticles = [];
    this.activeStars = [];
  }

  // Initialize both particle and star systems
  initialize() {
    this.initializeParticles();
    this.initializeStars();
  }
}

// Loading screen manager - Controls page loading overlay and transition animations
class LoadingScreenManager {
  constructor() {
    // Get loading screen DOM element reference
    this.loadingScreen = document.getElementById("loading-screen");
    // Track loading state for external access
    this.isLoading = true;
    this.init();
  }

  // Initialize loading screen manager and setup event handlers
  init() {
    if (!this.loadingScreen) {
      this.isLoading = false;
      return;
    }

    // Enable pointer events during loading to prevent user interaction
    this.loadingScreen.style.pointerEvents = "auto";
    this.setupPageLoadComplete();
  }

  // Setup page load completion detection with multiple readyState handling
  setupPageLoadComplete() {
    const hideNow = () => {
      this.hideLoadingScreen(100);
    };

    // Handle different document ready states for optimal loading experience
    if (document.readyState === "loading") {
      // Document still loading - wait for DOM content loaded
      document.addEventListener("DOMContentLoaded", hideNow, { once: true });
    } else if (document.readyState === "interactive") {
      // DOM loaded but resources may still be loading
      this.hideLoadingScreen(200);
    } else {
      // Document and resources fully loaded
      this.hideLoadingScreen(100);
    }
  }

  // Hide loading screen with smooth fade-out animation and cleanup
  hideLoadingScreen(delay = 100) {
    if (!this.loadingScreen) return;

    // Disable pointer events to allow interaction with page content
    this.loadingScreen.style.pointerEvents = "none";
    // Restore document scrolling capabilities
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflowY = "auto";

    // Start fade-out animation
    this.loadingScreen.style.opacity = "0";

    // Complete loading screen removal after animation
    setTimeout(() => {
      if (this.loadingScreen && this.loadingScreen.parentElement) {
        this.loadingScreen.style.display = "none";
        this.loadingScreen.style.visibility = "hidden";
      }
      // Update loading state and ensure scrolling is enabled
      this.isLoading = false;
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    }, delay + 400);
  }

  // Show loading screen for programmatic loading state management
  showLoadingScreen() {
    if (!this.loadingScreen) return;
    // Update loading state and display loading screen
    this.isLoading = true;
    this.loadingScreen.style.display = "flex";
    this.loadingScreen.style.visibility = "visible";
    this.loadingScreen.style.opacity = "1";
    this.loadingScreen.style.pointerEvents = "auto";
  }
}

// Global particle system instance for application-wide particle management
let particleSystem = null;

// Initialize particle system and create floating particles in designated container
function createParticles() {
  // Create particle system instance if not already initialized
  if (!particleSystem) {
    particleSystem = new ParticleSystem();
  }
  particleSystem.initializeParticles();
}

// Initialize particle system and create starfield background effect
function createStarfield() {
  // Create particle system instance if not already initialized
  if (!particleSystem) {
    particleSystem = new ParticleSystem();
  }
  particleSystem.initializeStars();
}

// Clean up all particle effects and release resources
function cleanupParticles() {
  if (particleSystem) {
    particleSystem.cleanup();
  }
}

// Initialize loading screen manager for page load transitions
const initLoadingScreen = () => {
  try {
    window.loadingScreenManager = new LoadingScreenManager();
  } catch (error) {
    console.log("Loading screen initialization skipped:", error.message);
  }
};

// Document ready state handling - Initialize effects based on current loading state
if (document.readyState === "loading") {
  // Document still loading - wait for DOM content to be ready
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize animated background system
    window.animatedBG = new AnimatedBackground();

    // Create particle system instance if not already initialized
    if (!particleSystem) {
      particleSystem = new ParticleSystem();
    }
    particleSystem.initialize();

    // Initialize loading screen manager
    initLoadingScreen();
  });

  // Handle complete page load including all resources
  window.addEventListener("load", () => {
    if (window.loadingScreenManager) {
      window.loadingScreenManager.hideLoadingScreen(100);
    }
  });
} else {
  // Document already loaded - initialize effects immediately
  window.animatedBG = new AnimatedBackground();

  // Create particle system instance if not already initialized
  if (!particleSystem) {
    particleSystem = new ParticleSystem();
  }
  particleSystem.initialize();

  // Initialize loading screen manager
  initLoadingScreen();

  // Handle complete page load including all resources
  window.addEventListener("load", () => {
    if (window.loadingScreenManager) {
      window.loadingScreenManager.hideLoadingScreen(100);
    }
  });
}

// Clean up resources before page unload to prevent memory leaks
window.addEventListener("beforeunload", () => {
  // Clean up particle system resources
  if (particleSystem) {
    particleSystem.cleanup();
  }
  // Clean up animated background resources
  if (window.animatedBG) {
    window.animatedBG.destroy();
  }
});

// Module export support for Node.js environments and bundlers
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    AnimatedBackground,
    ParticleSystem,
    LoadingScreenManager,
    createParticles,
    createStarfield,
    cleanupParticles,
  };
}
// Visual effects system with animated backgrounds, particle systems, and loading screen management
