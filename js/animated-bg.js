class AnimatedBackground {
  constructor(options = {}) {
    this.options = {
      baseImageUrl: "assets/bg.jpg",
      particleColor: 0x4dd4ff,
      particleCount: 40,
      speed: 0.8,
      scale: 1.0,
      ...options,
    };

    this.vantaEffect = null;
    this.isInitialized = false;
    this.init();
  }

  async init() {
    try {
      // Always try fallback first to ensure background is visible
      console.log("Initializing background with fallback image:", this.options.baseImageUrl);
      this.fallbackBackground();

      if (typeof THREE === "undefined" || typeof VANTA === "undefined") {
        console.warn("Vanta.js or THREE.js not loaded, loading from CDN...");
        await this.loadDependencies();
      }

      // Only create vanta effect if dependencies loaded successfully
      if (typeof THREE !== "undefined" && typeof VANTA !== "undefined") {
        console.log("Dependencies loaded successfully, creating Vanta effect");
        this.createVantaEffect();
        this.isInitialized = true;
      } else {
        console.warn("Dependencies failed to load, keeping static background");
      }
    } catch (error) {
      console.error("Failed to initialize animated background:", error);
      console.log("Using fallback background due to error");
      this.fallbackBackground();
    }
  }

  async loadDependencies() {
    return Promise.all([
      this.loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
      ),
      this.loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/vanta.js/0.5.24/vanta.waves.min.js",
      ),
    ]);
  }

  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = src;

      // Add timeout to prevent hanging
      const timeout = setTimeout(() => {
        console.warn(`Script loading timeout: ${src}`);
        reject(new Error(`Timeout loading ${src}`));
      }, 10000); // 10 second timeout

      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };

      script.onerror = (error) => {
        clearTimeout(timeout);
        console.warn(`Failed to load script: ${src}`, error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  }

  createVantaEffect() {
    // Check if vanta layer already exists
    if (!document.getElementById("vanta-bg")) {
      const vantaLayer = document.createElement("div");
      vantaLayer.id = "vanta-bg";
      vantaLayer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
      `;
      document.body.insertBefore(vantaLayer, document.body.firstChild);
    }

    const vantaContainer = document.getElementById("vanta-bg");

    try {
      this.vantaEffect = VANTA.WAVES({
        el: vantaContainer,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: window.innerHeight,
        minWidth: window.innerWidth,
        scale: this.options.scale,
        scaleMobile: 0.8,
        color: this.options.particleColor,
        shininess: 30,
        waveHeight: 20,
        waveSpeed: this.options.speed,
        zoom: 0.75,
        backgroundColor: 0x0a0e27, // Primary dark color
      });

      this.addBackgroundImage(vantaContainer);

      window.addEventListener("resize", () => this.handleResize());
    } catch (error) {
      console.error("Vanta.js initialization failed:", error);
      this.fallbackBackground();
    }
  }

  addBackgroundImage(container) {
    const bgImage = document.createElement("div");
    bgImage.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('${this.options.baseImageUrl}');
      background-size: cover;
      background-position: center;
      background-attachment: fixed;
      opacity: 0.3;
      z-index: -1;
      pointer-events: none;
    `;
    container.appendChild(bgImage);
  }

  handleResize() {
    if (this.vantaEffect) {
      this.vantaEffect.resize();
    }
  }

  fallbackBackground() {
    console.log("Falling back to static background image:", this.options.baseImageUrl);

    // Remove any existing vanta background
    const existingVanta = document.getElementById("vanta-bg");
    if (existingVanta) {
      existingVanta.remove();
    }

    // Apply static background to body
    const body = document.body;
    body.style.background = `
      linear-gradient(rgba(10, 14, 39, 0.7), rgba(10, 14, 39, 0.7)),
      url('${this.options.baseImageUrl}')
    `;
    body.style.backgroundSize = "cover";
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundPosition = "center";
    body.style.backgroundRepeat = "no-repeat";

    // Ensure the background is applied with higher specificity
    body.style.setProperty('background', `
      linear-gradient(rgba(10, 14, 39, 0.7), rgba(10, 14, 39, 0.7)),
      url('${this.options.baseImageUrl}')
    `, 'important');
    body.style.setProperty('background-size', 'cover', 'important');
    body.style.setProperty('background-attachment', 'fixed', 'important');
    body.style.setProperty('background-position', 'center', 'important');
    body.style.setProperty('background-repeat', 'no-repeat', 'important');
  }

  destroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
      this.vantaEffect = null;
    }
  }

  updateSettings(newOptions) {
    this.options = { ...this.options, ...newOptions };
    if (this.vantaEffect) {
      this.destroy();
      this.createVantaEffect();
    }
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.animatedBG = new AnimatedBackground();
  });
} else {
  window.animatedBG = new AnimatedBackground();
}

// Export for Node.js environments
if (typeof module !== "undefined" && module.exports) {
  module.exports = AnimatedBackground;
}
