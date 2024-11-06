import { expect, test } from 'vitest';
import { isLiteral } from '../../src/helpers/is-literal';

test('primitive', () => {
  expect(isLiteral('1')).toBe(true);
  expect(isLiteral('1.1')).toBe(true);
  expect(isLiteral('-1')).toBe(true);
  expect(isLiteral('-1.1')).toBe(true);
  expect(isLiteral('1e+10')).toBe(true);
  expect(isLiteral('1e-10')).toBe(true);
  expect(isLiteral('""')).toBe(true);
  expect(isLiteral('"string"')).toBe(true);
  expect(isLiteral("'string'")).toBe(true);
  expect(isLiteral('`string`')).toBe(true);
  expect(isLiteral('true')).toBe(true);
  expect(isLiteral('false')).toBe(true);
  expect(isLiteral('null')).toBe(true);
  expect(isLiteral('undefined')).toBe(true);
});

test('array', () => {
  expect(isLiteral('[]')).toBe(true);
  expect(isLiteral('[1, "string", {"a": true}]')).toBe(true);
});

test('object', () => {
  expect(isLiteral('{}')).toBe(true);
  expect(isLiteral('{"a": 1, "b": "string"}')).toBe(true);
});

test('special characters', () => {
  expect(isLiteral('"new\nline"')).toBe(true);
  expect(isLiteral("'	tab	'")).toBe(true);
  expect(isLiteral('"string\\"with\\"quotes"')).toBe(true);
});

test('regexp', () => {
  expect(isLiteral('/^regex$/')).toBe(true);
  expect(isLiteral('/abc/gi')).toBe(true);
});

test('variables, functions, and expressions', () => {
  expect(isLiteral('function() {}')).toBe(false);
  expect(isLiteral('() => {}')).toBe(false);
  expect(isLiteral('someVariable')).toBe(false);
  expect(isLiteral('[1, 2].map(x => x * 2)')).toBe(false);
});
