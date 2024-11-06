import { expect, test } from 'vitest';
import { parseExpression } from '../../src/helpers/parse-expression';

test('basic', () => {
  expect(parseExpression('x')).toEqual({ expression: 'x' });
  expect(parseExpression('x|abs')).toEqual({
    expression: 'x',
    filters: [{ name: 'abs' }],
  });
});

test('name and params', () => {
  expect(parseExpression('x | replace "a", "," | split ""')).toEqual({
    expression: 'x',
    filters: [
      {
        name: 'replace',
        params: '"a", ","',
      },
      {
        name: 'split',
        params: '""',
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
        params: '\'|\', ":", `,`',
      },
      {
        name: 'split',
        params: '""',
      },
    ],
  });
});
