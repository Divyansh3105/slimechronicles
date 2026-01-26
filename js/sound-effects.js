class SoundFeedback {
  static playEffect(type) {
    const effects = {
      click: () => this.createRipple(),
      recruit: () => this.createBurst("recruit"),
      achievement: () => this.createBurst("achievement"),
      mission: () => this.createBurst("mission"),
    };

    if (effects[type]) {
      effects[type]();
    }
  }

  static createRipple() {
    const ripple = document.createElement("div");
    ripple.className = "sound-ripple";
    ripple.style.left = `${event?.clientX || window.innerWidth / 2}px`;
    ripple.style.top = `${event?.clientY || window.innerHeight / 2}px`;
    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  }

  static createBurst(type) {
    const colors = {
      recruit: "rgba(255, 100, 255, 0.8)",
      achievement: "rgba(255, 215, 0, 0.8)",
      mission: "rgba(0, 255, 150, 0.8)",
    };

    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.className = "burst-particle";
      particle.style.background = colors[type] || "rgba(52, 211, 255, 0.8)";
      particle.style.left = "50%";
      particle.style.top = "50%";

      const angle = (i / 12) * Math.PI * 2;
      const distance = 100 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      particle.style.setProperty("--tx", `${tx}px`);
      particle.style.setProperty("--ty", `${ty}px`);

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1000);
    }
  }
}

window.SoundFeedback = SoundFeedback;
