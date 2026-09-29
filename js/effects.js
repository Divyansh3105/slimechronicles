class AnimatedBackground {
  constructor(options = {}) {
    this.options = {
      baseImageUrl: "assets/bg.jpg",
      enableAnimation: true,
      ...options,
    };

    this.particlesInstance = null;
    this.init();
  }

  init() {
    this.setupBaseBackground();

    if (this.options.enableAnimation) {
      this.loadParticlesJS();
    }
  }

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

  async loadParticlesJS() {
    try {
      // Check if particles.js is already loaded to avoid duplicate loading
      if (typeof particlesJS === "undefined") {
        await this.loadScript("https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js");
      }

      this.createParticlesContainer();
      this.initializeParticles();
    } catch (error) {
      console.warn("Failed to load particles.js, using base background only:", error);
    }
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  createParticlesContainer() {
    const existing = document.getElementById("particles-js");
    if (existing) {
      existing.remove();
    }

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

    document.body.insertBefore(particlesContainer, document.body.firstChild);
  }

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

    particlesJS("particles-js", particlesConfig);

    this.particlesInstance = window.pJSDom && window.pJSDom[0];
  }

  destroy() {
    if (this.particlesInstance && this.particlesInstance.pJS) {
      this.particlesInstance.pJS.fn.vendors.destroypJS();
      this.particlesInstance = null;
    }

    const container = document.getElementById("particles-js");
    if (container) {
      container.remove();
    }
  }

  enableAnimation() {
    this.options.enableAnimation = true;
    if (!this.particlesInstance) {
      this.loadParticlesJS();
    }
  }

  disableAnimation() {
    this.destroy();
    this.options.enableAnimation = false;
  }
}

class ParticleSystem {
  constructor() {
    this.particlePool = [];
    this.starPool = [];
    this.activeParticles = [];
    this.activeStars = [];
    this.maxParticles = this.getOptimalParticleCount();
    this.maxStars = Math.floor(this.maxParticles * 1.2);
    this.colors = ["blue", "cyan", "purple", "gold"];
  }

  getOptimalParticleCount() {
    let count = 15; // Base particle count for desktop devices

    if (window.isMobileDevice ? window.isMobileDevice() : window.innerWidth <= 768) {
      count = 8;
    }

    if (window.innerWidth < 480) {
      count = 5;
    }

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      count = Math.floor(count * 0.6);
    }

    // Respect user's reduced motion preference for accessibility
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      count = Math.floor(count * 0.3);
    }

    // low-memory devices
    if (navigator.deviceMemory && navigator.deviceMemory < 2) {
      count = 0;
    }

    return Math.max(count, 0);
  }

  createParticleElement() {
    const particle = document.createElement("div");
    particle.className = "particle";

    particle.style.willChange = "transform";
    particle.style.transform = "translate3d(0, 0, 0)";
    return particle;
  }

  createStarElement() {
    const star = document.createElement("div");
    star.className = "star";

    star.style.willChange = "transform";
    star.style.transform = "translate3d(0, 0, 0)";
    return star;
  }

  getParticle() {
    return this.particlePool.pop() || this.createParticleElement();
  }

  getStar() {
    return this.starPool.pop() || this.createStarElement();
  }

  releaseParticle(particle) {
    particle.style.display = "none";
    this.particlePool.push(particle);
  }

  releaseStar(star) {
    star.style.display = "none";
    this.starPool.push(star);
  }

  initializeParticles() {
    const container = document.getElementById("particles");
    if (!container) return;

    this.cleanup();

    for (let i = 0; i < this.maxParticles; i++) {
      const particle = this.getParticle();

      const colorClass = this.colors[Math.floor(Math.random() * this.colors.length)];
      particle.className = `particle ${colorClass}`;

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      particle.style.transform = `translate3d(${x}vw, ${y}vh, 0)`;

      particle.style.animationDelay = Math.random() * 10 + "s";
      particle.style.animationDuration = 10 + Math.random() * 10 + "s";

      const size = 2 + Math.random() * 3;
      particle.style.width = size + "px";
      particle.style.height = size + "px";
      particle.style.display = "block";

      container.appendChild(particle);
      this.activeParticles.push(particle);
    }
  }

  initializeStars() {
    const starfield = document.getElementById("starfield");
    if (!starfield) return;

    for (let i = 0; i < this.maxStars; i++) {
      const star = this.getStar();

      const x = Math.random() * 100;
      const y = Math.random() * 100;
      star.style.transform = `translate3d(${x}vw, ${y}vh, 0)`;

      const size = 1 + Math.random() * 2;
      star.style.width = size + "px";
      star.style.height = size + "px";

      star.style.animationDuration = 2 + Math.random() * 4 + "s";
      star.style.animationDelay = Math.random() * 5 + "s";
      star.style.display = "block";

      starfield.appendChild(star);
      this.activeStars.push(star);
    }
  }

  cleanup() {
    this.activeParticles.forEach((particle) => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
      this.releaseParticle(particle);
    });

    this.activeStars.forEach((star) => {
      if (star.parentNode) {
        star.parentNode.removeChild(star);
      }
      this.releaseStar(star);
    });

    this.activeParticles = [];
    this.activeStars = [];
  }

  initialize() {
    this.initializeParticles();
    this.initializeStars();
  }
}

class LoadingScreenManager {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.isLoading = true;
    this.init();
  }

  init() {
    if (!this.loadingScreen) {
      this.isLoading = false;
      return;
    }

    this.loadingScreen.style.pointerEvents = "auto";
    this.setupPageLoadComplete();
  }

  setupPageLoadComplete() {
    const hideNow = () => {
      this.hideLoadingScreen(100);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", hideNow, { once: true });
    } else if (document.readyState === "interactive") {
      this.hideLoadingScreen(200);
    } else {
      this.hideLoadingScreen(100);
    }
  }

  hideLoadingScreen(delay = 100) {
    if (!this.loadingScreen) return;

    this.loadingScreen.style.pointerEvents = "none";
    document.body.style.overflowY = "auto";
    document.documentElement.style.overflowY = "auto";

    this.loadingScreen.style.opacity = "0";

    setTimeout(() => {
      if (this.loadingScreen && this.loadingScreen.parentElement) {
        this.loadingScreen.style.display = "none";
        this.loadingScreen.style.visibility = "hidden";
      }
      this.isLoading = false;
      document.body.style.overflowY = "auto";
      document.documentElement.style.overflowY = "auto";
    }, delay + 400);
  }

  showLoadingScreen() {
    if (!this.loadingScreen) return;
    this.isLoading = true;
    this.loadingScreen.style.display = "flex";
    this.loadingScreen.style.visibility = "visible";
    this.loadingScreen.style.opacity = "1";
    this.loadingScreen.style.pointerEvents = "auto";
  }
}

let particleSystem = null;

function createParticles() {
  if (!particleSystem) {
    particleSystem = new ParticleSystem();
  }
  particleSystem.initializeParticles();
}

function createStarfield() {
  if (!particleSystem) {
    particleSystem = new ParticleSystem();
  }
  particleSystem.initializeStars();
}

function cleanupParticles() {
  if (particleSystem) {
    particleSystem.cleanup();
  }
}

const initLoadingScreen = () => {
  try {
    window.loadingScreenManager = new LoadingScreenManager();
  } catch (error) {
    console.warn("Loading screen initialization skipped:", error.message);
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.animatedBG = new AnimatedBackground();

    if (!particleSystem) {
      particleSystem = new ParticleSystem();
    }
    particleSystem.initialize();

    initLoadingScreen();
  });

  window.addEventListener("load", () => {
    if (window.loadingScreenManager) {
      window.loadingScreenManager.hideLoadingScreen(100);
    }
  });
} else {
  window.animatedBG = new AnimatedBackground();

  if (!particleSystem) {
    particleSystem = new ParticleSystem();
  }
  particleSystem.initialize();

  initLoadingScreen();

  window.addEventListener("load", () => {
    if (window.loadingScreenManager) {
      window.loadingScreenManager.hideLoadingScreen(100);
    }
  });
}

window.addEventListener("beforeunload", () => {
  if (particleSystem) {
    particleSystem.cleanup();
  }
  if (window.animatedBG) {
    window.animatedBG.destroy();
  }
});

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

document.addEventListener(
  "mousemove",
  window.throttle((e) => {
    // Only apply parallax if user hasn't requested reduced motion
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const xOffset = (window.innerWidth / 2 - e.pageX) / 50;
    const yOffset = (window.innerHeight / 2 - e.pageY) / 50;

    const magicCircles = document.querySelectorAll(".magic-circle");
    magicCircles.forEach((circle, index) => {
      const depth = index + 1;
      circle.style.setProperty("--parallax-x", `${xOffset * depth}px`);
      circle.style.setProperty("--parallax-y", `${yOffset * depth}px`);
    });

    const starfield = document.getElementById("starfield");
    if (starfield) {
      starfield.style.setProperty("--parallax-x", `${xOffset * 0.5}px`);
      starfield.style.setProperty("--parallax-y", `${yOffset * 0.5}px`);
    }
  }, 16)
);
