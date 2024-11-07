import { expect, test } from 'vitest';
import { parseFilter } from '../../src/helpers/parse-filter';

test('basic', () => {
  expect(parseFilter('abs')).toEqual({ name: 'abs' });
});

test('name and args', () => {
  expect(parseFilter('replace "a" b.c')).toEqual({
    name: 'replace',
    args: '"a" b.c',
  });
  expect(parseFilter('replace ":" "-"')).toEqual({
    name: 'replace',
    args: '":" "-"',
  });
});
