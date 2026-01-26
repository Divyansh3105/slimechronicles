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
      if (typeof THREE === "undefined" || typeof VANTA === "undefined") {
        console.warn("Vanta.js or THREE.js not loaded, loading from CDN...");
        await this.loadDependencies();
      }

      this.createVantaEffect();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize animated background:", error);
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
      script.onload = resolve;
      script.onerror = reject;
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
    // Fallback to original gradient + image background
    const body = document.body;
    body.style.background = `
      linear-gradient(rgba(10, 14, 39, 0.7), rgba(10, 14, 39, 0.7)),
      url('${this.options.baseImageUrl}')
    `;
    body.style.backgroundSize = "cover";
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundPosition = "center";
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
