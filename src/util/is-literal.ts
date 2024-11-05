/**
 * Check if a value is a literal.
 */
export function isLiteral(value: string) {
  return (
    value === 'true' ||
    value === 'false' ||
    value === 'null' ||
    value === 'undefined' ||
    !isNaN(value as unknown as number) ||
    /^(['"`]).*\1$/ms.test(value) ||
    /^{.*}$/ms.test(value) ||
    /^\[.*\]$/ms.test(value) ||
    /^\/.+\/[a-z]*$/ms.test(value)
  );
}
