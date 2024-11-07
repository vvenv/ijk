import { expect, test } from 'vitest';
import { parseFormalArgs } from '../../src/helpers/parse-formal-args';

test('basic', () => {
  expect(parseFormalArgs('a')).toEqual(['a']);
});

test('multiple', () => {
  expect(parseFormalArgs('a b')).toEqual(['a', 'b']);
  expect(parseFormalArgs('a  b')).toEqual(['a', 'b']);
});

test('duo', () => {
  expect(parseFormalArgs('a a')).toEqual(['a', 'a']);
});

test('default args', () => {
  expect(parseFormalArgs('a="foo"')).toEqual(['a="foo"']);
  expect(parseFormalArgs('a="foo" b=`bar` c=123')).toEqual([
    'a="foo"',
    'b=`bar`',
    'c=123',
  ]);
});
