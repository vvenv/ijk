import { expect, test } from 'vitest';
import { isInclude } from '../../src/utils/is-include';

test('array', () => {
  expect(isInclude(['f', 'o', 'o'], 'f')).toBe(true);
  expect(isInclude(['f', 'o', 'o'], 'oo')).toBe(false);
});

test('object', () => {
  expect(isInclude({ a: 'f', b: 'o', c: 'o' }, 'f')).toBe(true);
  expect(isInclude({ a: 'f', b: 'o', c: 'o' }, 'oo')).toBe(false);
});

test('string', () => {
  expect(isInclude('foo', 'f')).toBe(true);
  expect(isInclude('foo', 'oo')).toBe(true);
  expect(isInclude('foo', 'b')).toBe(false);
});

test('other', () => {
  expect(isInclude(1, 1)).toBe(false);
  expect(isInclude(false, true)).toBe(false);
  expect(isInclude(null, undefined)).toBe(false);
});
