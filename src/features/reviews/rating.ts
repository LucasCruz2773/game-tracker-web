export const MIN_REVIEW_RATING = 1;
export const MAX_REVIEW_RATING = 10;
export const MAX_REVIEW_BODY_LENGTH = 5_000;

export function toStarRating(rating: number): number {
  return rating / 2;
}

/** Formats a 0.5–5 star value for display (e.g. 4, 3.5). */
export function formatStarRating(starRating: number): string {
  return Number.isInteger(starRating)
    ? String(starRating)
    : starRating.toFixed(1).replace('.', ',');
}
