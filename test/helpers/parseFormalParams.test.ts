import { expect, test } from 'vitest';
import { parseFormalParams } from '../../src/helpers/parse-formal-params';

test('basic', () => {
  expect(parseFormalParams('a')).toEqual(['a']);
});

test('multiple', () => {
  expect(parseFormalParams('a b')).toEqual(['a', 'b']);
  expect(parseFormalParams('a  b')).toEqual(['a', 'b']);
});

test('duo', () => {
  expect(parseFormalParams('a a')).toEqual(['a', 'a']);
});

test('default params', () => {
  expect(parseFormalParams('a="foo"')).toEqual(['a="foo"']);
  expect(parseFormalParams('a="foo" b=`bar` c=123')).toEqual([
    'a="foo"',
    'b=`bar`',
    'c=123',
  ]);
});
