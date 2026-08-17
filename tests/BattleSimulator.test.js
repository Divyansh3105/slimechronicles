import { describe, it, expect, beforeEach } from 'vitest';
const { BattleSimulator } = require('../js/components/BattleSimulator.js');

describe('BattleSimulator', () => {
  let sim;

  beforeEach(() => {
    sim = new BattleSimulator();
  });

  it('should initialize database with major Tensura fighters and EP values', () => {
    expect(Object.keys(sim.database).length).toBeGreaterThanOrEqual(6);
    expect(sim.database.rimuru).toBeDefined();
    expect(sim.database.guy).toBeDefined();
    expect(sim.database.milim).toBeDefined();
    expect(sim.database.veldora).toBeDefined();
  });

  it('should properly render and compute comparison between fighters', () => {
    sim.charA = 'rimuru';
    sim.charB = 'guy';
    expect(() => sim.updateComparison()).not.toThrow();
  });

  it('should correctly handle mirror matches', () => {
    sim.charA = 'rimuru';
    sim.charB = 'rimuru';
    expect(() => sim.runSimulation()).not.toThrow();
  });
});
