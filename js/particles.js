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
    let count = 15;

    if (window.innerWidth < 768) {
      count = 8;
    }

    if (window.innerWidth < 480) {
      count = 5;
    }

    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
      count = Math.floor(count * 0.6);
    }

    if (
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      count = Math.floor(count * 0.3);
    }

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

      const colorClass =
        this.colors[Math.floor(Math.random() * this.colors.length)];
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

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (!particleSystem) {
      particleSystem = new ParticleSystem();
    }
    particleSystem.initialize();
  });
} else {
  if (!particleSystem) {
    particleSystem = new ParticleSystem();
  }
  particleSystem.initialize();
}
window.addEventListener("beforeunload", () => {
  if (particleSystem) {
    particleSystem.cleanup();
  }
});
if (typeof performance !== "undefined" && performance.mark) {
  performance.mark("particles-start");

  setTimeout(() => {
    performance.mark("particles-end");
    try {
      performance.measure("particles-init", "particles-start", "particles-end");
      const measure = performance.getEntriesByName("particles-init")[0];
    } catch (e) {}
  }, 100);
}
