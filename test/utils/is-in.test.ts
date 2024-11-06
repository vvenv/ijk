import { expect, test } from 'vitest';
import { isIn } from '../../src/utils/is-in';

test('array', () => {
  expect(isIn('f', ['f', 'o', 'o'])).toBe(true);
  expect(isIn('oo', ['f', 'o', 'o'])).toBe(false);
});

test('object', () => {
  expect(isIn('f', { a: 'f', b: 'o', c: 'o' })).toBe(true);
  expect(isIn('oo', { a: 'f', b: 'o', c: 'o' })).toBe(false);
});

test('string', () => {
  expect(isIn('f', 'foo')).toBe(true);
  expect(isIn('oo', 'foo')).toBe(true);
  expect(isIn('b', 'foo')).toBe(false);
});

test('other', () => {
  expect(isIn(1, 1)).toBe(false);
  expect(isIn(false, true)).toBe(false);
  expect(isIn(null, undefined)).toBe(false);
});
