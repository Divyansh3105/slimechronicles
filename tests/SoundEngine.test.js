import { describe, it, expect, beforeEach, vi } from 'vitest';
const { SoundEngine } = require('../js/utils/SoundEngine.js');

describe('SoundEngine', () => {
  let soundEngine;

  beforeEach(() => {
    // Clear localStorage mocks
    localStorage.clear();
    soundEngine = new SoundEngine();
  });

  it('should initialize with default enabled state and volume', () => {
    expect(soundEngine.isEnabled).toBe(true);
    expect(soundEngine.volume).toBe(0.25);
  });

  it('should toggle enabled state', () => {
    expect(soundEngine.isEnabled).toBe(true);
    const newState = soundEngine.toggle();
    expect(newState).toBe(false);
    expect(soundEngine.isEnabled).toBe(false);
    expect(localStorage.getItem('slime-sfx-enabled')).toBe('false');

    const backOn = soundEngine.toggle();
    expect(backOn).toBe(true);
    expect(soundEngine.isEnabled).toBe(true);
  });

  it('should clamp volume between 0 and 1', () => {
    soundEngine.setVolume(1.5);
    expect(soundEngine.volume).toBe(1);

    soundEngine.setVolume(-0.2);
    expect(soundEngine.volume).toBe(0);

    soundEngine.setVolume(0.65);
    expect(soundEngine.volume).toBe(0.65);
  });

  it('should safely handle play() calls when disabled', () => {
    soundEngine.isEnabled = false;
    // Should not throw or crash
    expect(() => soundEngine.play('hover')).not.toThrow();
    expect(() => soundEngine.play('greatSage')).not.toThrow();
  });

  it('should safely handle play() calls for all sound presets', () => {
    const sounds = ['hover', 'click', 'select', 'greatSage', 'skillFuse', 'themeSwitch', 'openModal', 'closeModal', 'success'];
    sounds.forEach((snd) => {
      expect(() => soundEngine.play(snd)).not.toThrow();
    });
  });
});
