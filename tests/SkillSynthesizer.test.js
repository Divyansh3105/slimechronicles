import { describe, it, expect, beforeEach } from 'vitest';
const { SkillSynthesizer } = require('../js/components/SkillSynthesizer.js');

describe('SkillSynthesizer', () => {
  let synth;

  beforeEach(() => {
    synth = new SkillSynthesizer();
  });

  it('should initialize with base skills and synthesis recipes', () => {
    expect(synth.baseSkills.length).toBeGreaterThan(8);
    expect(synth.recipes.length).toBeGreaterThan(4);
  });

  it('should select skills into slot A and slot B', () => {
    synth.selectSkill('predator');
    expect(synth.slotA.id).toBe('predator');
    expect(synth.slotB).toBeNull();

    synth.selectSkill('great_sage');
    expect(synth.slotA.id).toBe('predator');
    expect(synth.slotB.id).toBe('great_sage');
  });

  it('should prevent selecting identical skill in both slots', () => {
    synth.selectSkill('predator');
    synth.selectSkill('predator');
    expect(synth.slotA.id).toBe('predator');
    expect(synth.slotB).toBeNull();
  });

  it('should correctly match valid recipes regardless of slot order', () => {
    const recipeA = synth.recipes.find(r => 
      (r.inputs[0] === 'predator' && r.inputs[1] === 'great_sage') ||
      (r.inputs[1] === 'predator' && r.inputs[0] === 'great_sage')
    );
    expect(recipeA).toBeDefined();
    expect(recipeA.result.name).toContain('Beelzebuth');

    const recipeB = synth.recipes.find(r => 
      (r.inputs[0] === 'great_sage' && r.inputs[1] === 'degenerate') ||
      (r.inputs[1] === 'great_sage' && r.inputs[0] === 'degenerate')
    );
    expect(recipeB).toBeDefined();
    expect(recipeB.result.name).toContain('Raphael');
  });
});
