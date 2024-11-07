/**
 * Parse formal parameters.
 * @example `{{ macro x a b="foo" }}`
 *                      ^^^^^^^^^
 */
export function parseFormalArgs(statement: string | undefined) {
  if (!statement) {
    return [];
  }

  const args: string[] = [];
  const argRe = /(?:(\w+=(?:(['"`]).*?\2)|(?:[^'"`\s]+))|([^'"`\s]+?))/g;

  let match;
  while ((match = argRe.exec(statement))) {
    const [_, defaultArg, __, arg = defaultArg] = match;
    args.push(arg);
  }

  return args;
}
