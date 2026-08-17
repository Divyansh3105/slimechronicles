import { describe, it, expect, beforeEach } from 'vitest';
const { AnimationManager } = require('../js/animations.js');

describe('AnimationManager', () => {
  let animManager;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="stat-element">10</div>
      <div class="card-item">Card 1</div>
      <div class="card-item">Card 2</div>
      <div id="modal" style="display: none;"><div class="modal-content">Content</div></div>
    `;
    animManager = new AnimationManager();
  });

  it('should initialize successfully', () => {
    expect(animManager).toBeDefined();
    expect(animManager.prefersReducedMotion).toBe(false);
  });

  it('should resolve elements from selector string or array', () => {
    const fromSelector = animManager.resolveElements('.card-item');
    expect(fromSelector.length).toBe(2);

    const singleEl = document.getElementById('stat-element');
    const fromSingle = animManager.resolveElements(singleEl);
    expect(fromSingle.length).toBe(1);
    expect(fromSingle[0]).toBe(singleEl);
  });

  it('should handle card stagger fallback when GSAP is not loaded', () => {
    const cards = document.querySelectorAll('.card-item');
    animManager.animateCardStagger('.card-item');
    cards.forEach((card) => {
      expect(card.style.opacity).toBe('1');
    });
  });

  it('should handle stat counter fallback cleanly', () => {
    const el = document.getElementById('stat-element');
    animManager.animateStatCounter(el, 50);
    expect(el.textContent).toBe('50');
  });

  it('should open and close modal cleanly in fallback mode', () => {
    const modal = document.getElementById('modal');
    animManager.animateModalOpen(modal);
    expect(modal.style.display).toBe('flex');

    let closed = false;
    animManager.animateModalClose(modal, null, () => {
      closed = true;
    });
    expect(modal.style.display).toBe('none');
    expect(closed).toBe(true);
  });

  it('should enable 3D tilt and attach glare element to card items', () => {
    animManager.enable3DTilt('.card-item');
    const cards = document.querySelectorAll('.card-item');
    cards.forEach((card) => {
      expect(card.classList.contains('has-3d-tilt')).toBe(true);
      expect(card.querySelector('.tilt-glare')).not.toBeNull();
    });
  });
});
