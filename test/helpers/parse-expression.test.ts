import { expect, test } from 'vitest';
import { parseExpression } from '../../src/helpers/parse-expression';

test('basic', () => {
  expect(parseExpression('x')).toEqual({ expression: 'x' });
  expect(parseExpression('x|abs')).toEqual({
    expression: 'x',
    filters: [{ name: 'abs' }],
  });
});

test('name and args', () => {
  expect(parseExpression('x | replace "a", "," | split ""')).toEqual({
    expression: 'x',
    filters: [
      {
        name: 'replace',
        args: '"a", ","',
      },
      {
        name: 'split',
        args: '""',
      },
    ],
  });
});

test.skip('special characters', () => {
  expect(parseExpression('x | replace \'|\', ":", `,` | split ""')).toEqual({
    expression: 'x',
    filters: [
      {
        name: 'replace',
        args: '\'|\', ":", `,`',
      },
      {
        name: 'split',
        args: '""',
      },
    ],
  });
});
