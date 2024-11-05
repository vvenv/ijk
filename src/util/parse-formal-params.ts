/**
 * Parse formal parameters.
 * @example `{{ macro x a b="foo" }}`
 *                      ^^^^^^^^^
 */
export function parseFormalParams(params: string | undefined) {
  if (!params) {
    return [];
  }

  const _params: string[] = [];
  const paramRe = /(?:(\w+=(?:(['"`]).*?\2)|(?:[^'"`\s]+))|([^'"`\s]+?))/g;

  let match;
  while ((match = paramRe.exec(params))) {
    const [_, defaultParam, __, param = defaultParam] = match;
    _params.push(param);
  }

  return _params;
}
