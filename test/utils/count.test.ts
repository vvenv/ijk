import { expect, test } from 'vitest';
import { count } from '../../src/utils/count';

test('array', () => {
  expect(count(['f', 'o', 'o'])).toBe(3);
});

test('object', () => {
  expect(count({ a: 'f', b: 'o', c: 'o' })).toBe(3);
});

test('string', () => {
  expect(count('foo')).toBe(3);
});

test('other', () => {
  expect(count(1)).toBe(1);
  expect(count(11)).toBe(11);
});
