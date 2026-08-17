/**
 * Jura Tempest Federation - Sound Effects Engine
 * Uses Web Audio API for zero-latency, synthesized anime-style UI sound effects
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isEnabled = true;
    this.volume = 0.25; // Default 25% volume for subtle UI feedback
    this.storageKey = "slime-sfx-enabled";
    this.volStorageKey = "slime-sfx-volume";

    this.loadSettings();
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  loadSettings() {
    try {
      if (typeof localStorage !== "undefined") {
        const savedEnabled = localStorage.getItem(this.storageKey);
        if (savedEnabled !== null) {
          this.isEnabled = savedEnabled === "true";
        }
        const savedVol = localStorage.getItem(this.volStorageKey);
        if (savedVol !== null) {
          this.volume = parseFloat(savedVol);
        }
      }
    } catch {
      // Ignore localStorage access issues
    }
  }

  saveSettings() {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.storageKey, this.isEnabled.toString());
        localStorage.setItem(this.volStorageKey, this.volume.toString());
      }
    } catch {
      // Ignore localStorage access issues
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    this.saveSettings();
    if (this.isEnabled) {
      this.play("click");
    }
    return this.isEnabled;
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.saveSettings();
  }

  /**
   * Play a synthesized sound effect
   * @param {'hover'|'click'|'greatSage'|'skillFuse'|'themeSwitch'|'openModal'|'closeModal'|'success'|'select'} name
   */
  play(name) {
    if (!this.isEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume, now);
      masterGain.connect(this.ctx.destination);

      switch (name) {
        case "hover":
          this._playHover(now, masterGain);
          break;
        case "click":
          this._playClick(now, masterGain);
          break;
        case "select":
          this._playSelect(now, masterGain);
          break;
        case "greatSage":
          this._playGreatSage(now, masterGain);
          break;
        case "skillFuse":
          this._playSkillFuse(now, masterGain);
          break;
        case "themeSwitch":
          this._playThemeSwitch(now, masterGain);
          break;
        case "openModal":
          this._playOpenModal(now, masterGain);
          break;
        case "closeModal":
          this._playCloseModal(now, masterGain);
          break;
        case "success":
          this._playSuccess(now, masterGain);
          break;
        default:
          this._playClick(now, masterGain);
      }
    } catch (e) {
      console.debug("SoundEngine playback error:", e);
    }
  }

  _playHover(now, out) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  _playClick(now, out) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(659.25, now); // E5
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.07); // A4

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  _playSelect(now, out) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.09);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Signature Great Sage / Raphael chime (Two-tone crystal bell)
  _playGreatSage(now, out) {
    [
      { freq: 880, start: 0, dur: 0.28 }, // A5
      { freq: 1318.51, start: 0.12, dur: 0.45 }, // E6
      { freq: 1760, start: 0.22, dur: 0.55 } // A6
    ].forEach((tone) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(tone.freq, now + tone.start);

      gain.gain.setValueAtTime(0, now + tone.start);
      gain.gain.linearRampToValueAtTime(0.22, now + tone.start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + tone.start + tone.dur);

      osc.connect(gain);
      gain.connect(out);
      osc.start(now + tone.start);
      osc.stop(now + tone.start + tone.dur + 0.05);
    });
  }

  // Skill fusion ascending magical arpeggio
  _playSkillFuse(now, out) {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.06;
      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.18, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.25);

      osc.connect(gain);
      gain.connect(out);
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  _playThemeSwitch(now, out) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(330, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  _playOpenModal(now, out) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  _playCloseModal(now, out) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(out);
    osc.start(now);
    osc.stop(now + 0.14);
  }

  _playSuccess(now, out) {
    [587.33, 880, 1174.66].forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const st = now + i * 0.08;
      osc.type = "sine";
      osc.frequency.setValueAtTime(f, st);
      gain.gain.setValueAtTime(0.18, st);
      gain.gain.exponentialRampToValueAtTime(0.001, st + 0.2);
      osc.connect(gain);
      gain.connect(out);
      osc.start(st);
      osc.stop(st + 0.22);
    });
  }

  /**
   * Automatically bind interactive hover & click SFX to standard buttons & links
   */
  attachGlobalListeners() {
    if (typeof document === "undefined") return;

    // Attach listeners on user interaction
    const unlock = () => {
      this.initContext();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    document.addEventListener("pointerenter", (e) => {
      const target = e.target.closest("button, .nav-links a, .nav-brand, .character-card, .skill-card, .codex-card, .btn-action, .theme-btn");
      if (target) {
        this.play("hover");
      }
    }, true);

    document.addEventListener("click", (e) => {
      const target = e.target.closest("button, .nav-links a, .btn-action, .theme-btn, .close-btn, .modal-close");
      if (target) {
        if (target.classList.contains("modal-close") || target.classList.contains("close-btn")) {
          this.play("closeModal");
        } else {
          this.play("click");
        }
      }
    }, true);
  }
}

// Export singleton instance
const soundEngineInstance = new SoundEngine();
if (typeof window !== "undefined") {
  window.SoundEngine = soundEngineInstance;
  // Initialize automatic UI listeners after DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => soundEngineInstance.attachGlobalListeners());
  } else {
    soundEngineInstance.attachGlobalListeners();
  }
}

// Support CommonJS/ESM testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SoundEngine, soundEngineInstance };
}
