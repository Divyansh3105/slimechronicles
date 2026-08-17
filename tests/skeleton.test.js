import { describe, it, expect } from 'vitest';

describe('Skeleton Loader Structure', () => {
  it('should generate valid skeleton loader HTML components', () => {
    const skeletonCard = `<div class="skeleton-card"><div class="skeleton skeleton-title"></div><div class="skeleton skeleton-text full"></div></div>`;
    expect(skeletonCard).toContain('skeleton-card');
    expect(skeletonCard).toContain('skeleton-title');
    expect(skeletonCard).toContain('skeleton-text full');
  });
});
