export interface FilterMeta {
  name: string;
  params?: string;
}

/**
 * Parse a filter with optional parameters.
 * @example `replace a b` in `{{ x | replace a b }}`
 */
export function parseFilter(filter: string): FilterMeta {
  const [, name, params] = filter.match(/^(\w+)(?:\s+(.+?))?$/) ?? [];
  return {
    name,
    params,
  };
}
