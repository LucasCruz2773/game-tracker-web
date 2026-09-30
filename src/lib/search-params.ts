/** Reads a 1-based page number, falling back to 1 for missing or invalid values. */
export function parsePageParam(value: string | null): number {
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 ? page : 1;
}

/** Narrows a query string value to one of the allowed options. */
export function parseEnumParam<TOption extends string>(
  value: string | null,
  options: readonly TOption[],
): TOption | undefined {
  return options.find((option) => option === value);
}
