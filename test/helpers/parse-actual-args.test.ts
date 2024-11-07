import { expect, test } from 'vitest';
import { parseActualArgs } from '../../src/helpers/parse-actual-args';

test('basic', () => {
  expect(parseActualArgs('a', 'c')).toEqual(['c.a']);
});

test('multiple', () => {
  expect(parseActualArgs('a b', 'c')).toEqual(['c.a', 'c.b']);
  expect(parseActualArgs('a  b', 'c')).toEqual(['c.a', 'c.b']);
  expect(parseActualArgs('a a', 'c')).toEqual(['c.a', 'c.a']);
});

test('literal', () => {
  expect(parseActualArgs("''", 'c')).toEqual(["''"]);
  expect(parseActualArgs('""', 'c')).toEqual(['""']);
  expect(parseActualArgs('``', 'c')).toEqual(['``']);
  expect(parseActualArgs('","', 'c')).toEqual(['","']);
  expect(parseActualArgs('"a"', 'c')).toEqual(['"a"']);
  expect(parseActualArgs('"a" "b"', 'c')).toEqual(['"a"', '"b"']);
  expect(parseActualArgs('"a" "a"', 'c')).toEqual(['"a"', '"a"']);
});

test('mixture', () => {
  expect(parseActualArgs('\'a\' "a" `a` a', 'c')).toEqual([
    "'a'",
    '"a"',
    '`a`',
    'c.a',
  ]);
  expect(parseActualArgs('\',\' "," `,` a', 'c')).toEqual([
    "','",
    '","',
    '`,`',
    'c.a',
  ]);
});
