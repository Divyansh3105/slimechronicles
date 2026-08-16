import { describe, it, expect } from 'vitest';
const { generateCharacterImpact, filterCharacter } = require('../js/codex.js');

describe('Codex Logic', () => {
  describe('generateCharacterImpact', () => {
    it('should assign extremely high base impact for Catastrophe+ characters', () => {
      const char = { power: 'Catastrophe+', role: 'None', id: 'unknown' };
      const impact = generateCharacterImpact(char);
      expect(impact.military).toBeGreaterThanOrEqual(45);
      expect(impact.economy).toBeGreaterThanOrEqual(35);
    });

    it('should apply military bonuses for combat roles', () => {
      // B-Rank base is ~10 military
      const char = { power: 'B-Rank', role: 'Knight Commander', id: 'unknown' };
      const impact = generateCharacterImpact(char);
      // Base (10-17) + Combat Role (10) = 20-27
      expect(impact.military).toBeGreaterThanOrEqual(20);
    });

    it('should apply specific overrides for named characters', () => {
      const char = { id: 'rimuru', power: 'Catastrophe+', role: 'Demon Lord' };
      const impact = generateCharacterImpact(char);
      expect(impact.military).toBe(65);
      expect(impact.economy).toBe(70);
    });
  });

  describe('filterCharacter', () => {
    const rimuru = { name: 'Rimuru', power: 'Catastrophe+', role: 'Demon Lord' };
    const gobta = { name: 'Gobta', power: 'B-Rank', role: 'Captain' };
    const benimaru = { name: 'Benimaru', power: 'Disaster', role: 'Commander' };

    it('should always return true for "all" filter', () => {
      expect(filterCharacter(rimuru, 'all')).toBe(true);
      expect(filterCharacter(gobta, 'all')).toBe(true);
    });

    it('should correctly filter demon lords', () => {
      expect(filterCharacter(rimuru, 'demon-lord')).toBe(true);
      expect(filterCharacter(gobta, 'demon-lord')).toBe(false);
    });

    it('should correctly filter disaster class', () => {
      expect(filterCharacter(rimuru, 'disaster')).toBe(true);
      expect(filterCharacter(gobta, 'disaster')).toBe(false);
    });

    it('should correctly filter named characters (exclude generic ranks)', () => {
      expect(filterCharacter(rimuru, 'named')).toBe(true);
      expect(filterCharacter(benimaru, 'named')).toBe(true);
      expect(filterCharacter(gobta, 'named')).toBe(false);
    });
  });
});
