import { FILTERS } from '../config';
import { isLiteral } from './is-literal';
import { parseActualParams } from './parse-actual-params';
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
    for (const { name, params } of filters) {
      const paramsStr: string = [
        identifier,
        ...parseActualParams(params, context),
      ].join(',');
      identifier = `${FILTERS}.${name}(${paramsStr})`;
    }
  }

  return identifier;
}
