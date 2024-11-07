import { FILTERS } from '../config';
import { isLiteral } from './is-literal';
import { parseActualArgs } from './parse-actual-args';
import { FilterMeta } from './parse-filter';

/**
 * Returns the expression with filters applied
 */
export function compileExpression(
  expression: string,
  context: string,
  filters: FilterMeta[] = [],
) {
  let identifier = isLiteral(expression)
    ? expression
    : `${context}.${expression}`;

  if (filters.length) {
    for (const { name, args } of filters) {
      const argStr: string = [
        identifier,
        ...parseActualArgs(args, context),
      ].join(',');
      identifier = `${FILTERS}.${name}(${argStr})`;
    }
  }

  return identifier;
}
