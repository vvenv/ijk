import { isLiteral } from './is-literal';

/**
 * Parse actual parameters.
 * @example {{ x | replace a "b" }}
 *                 ^^^^^^^^^^^^^
 */
export function parseActualParams(params: string | undefined, context: string) {
  if (!params) {
    return [];
  }

  const _params: string[] = [];
  const paramRe = /(?:(['"`])(.*?)\1|([^'"`\s]+?))/g;

  let match;
  while ((match = paramRe.exec(params))) {
    const [_, quote, literal, param] = match;
    _params.push(
      quote
        ? `${quote}${literal}${quote}`
        : isLiteral(param)
          ? param
          : `${context}.${param}`,
    );
  }

  return _params;
}
