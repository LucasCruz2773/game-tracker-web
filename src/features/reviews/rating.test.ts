import { describe, expect, it } from 'vitest';
import { toStarRating } from './rating';

describe('toStarRating', () => {
  it('maps stored half-steps to stars', () => {
    expect(toStarRating(7)).toBe(3.5);
    expect(toStarRating(9)).toBe(4.5);
    expect(toStarRating(8)).toBe(4);
  });
});
