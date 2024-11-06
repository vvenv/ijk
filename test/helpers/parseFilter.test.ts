import { expect, test } from 'vitest';
import { parseFilter } from '../../src/helpers/parse-filter';

test('basic', () => {
  expect(parseFilter('abs')).toEqual({ name: 'abs' });
});

test('name and params', () => {
  expect(parseFilter('replace "a" b.c')).toEqual({
    name: 'replace',
    params: '"a" b.c',
  });
  expect(parseFilter('replace ":" "-"')).toEqual({
    name: 'replace',
    params: '":" "-"',
  });
});
