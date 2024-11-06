import { FilterMeta, parseFilter } from './parse-filter';
/**
 * Parse an expression with optional filters.
 * @example parseExpression('x | replace "a" ","')
 */
export function parseExpression(template: string) {
  const [_, expression, rest] =
    template.match(/^(.+?)(?:\s*(\|.+?))?$/ms) ?? [];

  if (!rest) {
    return { expression };
  }

  const filters: FilterMeta[] = [];
  const filterRe = /\s*\|\s*(.+?)(?=\s*\||$)/g;

  let match;
  while ((match = filterRe.exec(rest))) {
    const [_, filter] = match;
    filters.push(parseFilter(filter));
  }

  if (filters.length) {
    return {
      expression,
      filters,
    };
  }

  return { expression };
}
