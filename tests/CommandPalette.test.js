import { describe, it, expect, beforeEach } from 'vitest';
const { CommandPalette } = require('../js/components/CommandPalette.js');

describe('CommandPalette', () => {
  let palette;

  beforeEach(() => {
    palette = new CommandPalette();
  });

  it('should initialize database with core Tensura entries', () => {
    expect(palette.database.length).toBeGreaterThan(15);
    const rimuru = palette.database.find(item => item.title.includes('Rimuru'));
    expect(rimuru).toBeDefined();
    expect(rimuru.category).toBe('Characters');

    const raphael = palette.database.find(item => item.title.includes('Raphael') || item.title.includes('Ciel'));
    expect(raphael).toBeDefined();
    expect(raphael.category).toBe('Skills');
  });

  it('should correctly filter items on search()', () => {
    palette.search('Diablo');
    expect(palette.results.length).toBeGreaterThanOrEqual(1);
    expect(palette.results[0].title).toContain('Diablo');

    palette.search('Demon Lord');
    expect(palette.results.length).toBeGreaterThan(0);

    palette.search('nonexistent_tensura_query_123');
    expect(palette.results.length).toBe(0);
  });

  it('should provide top defaults when search query is empty', () => {
    palette.search('');
    expect(palette.results.length).toBe(8);
  });
});
