import { describe, it, expect } from 'vitest';
import charactersData from '../data/characters-basic.json';

describe('Character Data & Stats', () => {
  it('should load all canonical characters', () => {
    expect(Array.isArray(charactersData)).toBe(true);
    expect(charactersData.length).toBeGreaterThanOrEqual(30);
  });

  it('should validate core fields for each character entry', () => {
    charactersData.forEach(char => {
      expect(char.id).toBeDefined();
      expect(typeof char.id).toBe('string');
      expect(char.name).toBeDefined();
      expect(typeof char.name).toBe('string');
      expect(char.race).toBeDefined();
      expect(char.role).toBeDefined();
      expect(char.power).toBeDefined();
      expect(char.colorScheme).toBeDefined();
      expect(char.colorScheme.primary).toMatch(/^#/);
    });
  });

  it('should include key executives and leaders', () => {
    const ids = charactersData.map(c => c.id);
    expect(ids).toContain('rimuru');
    expect(ids).toContain('benimaru');
    expect(ids).toContain('shion');
    expect(ids).toContain('shuna');
    expect(ids).toContain('diablo');
    expect(ids).toContain('veldora');
    expect(ids).toContain('milim');
    expect(ids).toContain('guy');
  });

  it('should filter characters by power tier properly', () => {
    const catastropheClass = charactersData.filter(c => c.power === 'Catastrophe');
    expect(catastropheClass.length).toBeGreaterThan(0);
    const rimuru = catastropheClass.find(c => c.id === 'rimuru');
    expect(rimuru).toBeDefined();
  });
});
