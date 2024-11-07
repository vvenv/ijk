import { isLiteral } from './is-literal';

/**
 * Parse actual parameters.
 * @example {{ x | replace a "b" }}
 *                 ^^^^^^^^^^^^^
 */
export function parseActualArgs(
  statement: string | undefined,
  context: string,
) {
  if (!statement) {
    return [];
  }

  const args: string[] = [];
  const argRe = /(?:(['"`])(.*?)\1|([^'"`\s]+?))/g;

  let match;
  while ((match = argRe.exec(statement))) {
    const [_, quote, literal, arg] = match;
    args.push(
      quote
        ? `${quote}${literal}${quote}`
        : isLiteral(arg)
          ? arg
          : `${context}.${arg}`,
    );
  }

  return args;
}
