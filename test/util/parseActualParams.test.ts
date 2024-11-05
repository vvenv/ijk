import { expect, test } from 'vitest';
import { parseActualParams } from '../../src/util/parse-actual-params';

test('basic', () => {
  expect(parseActualParams('a', 'c')).toEqual(['c.a']);
});

test('multiple', () => {
  expect(parseActualParams('a b', 'c')).toEqual(['c.a', 'c.b']);
  expect(parseActualParams('a  b', 'c')).toEqual(['c.a', 'c.b']);
  expect(parseActualParams('a a', 'c')).toEqual(['c.a', 'c.a']);
});

test('literal', () => {
  expect(parseActualParams("''", 'c')).toEqual(["''"]);
  expect(parseActualParams('""', 'c')).toEqual(['""']);
  expect(parseActualParams('``', 'c')).toEqual(['``']);
  expect(parseActualParams('","', 'c')).toEqual(['","']);
  expect(parseActualParams('"a"', 'c')).toEqual(['"a"']);
  expect(parseActualParams('"a" "b"', 'c')).toEqual(['"a"', '"b"']);
  expect(parseActualParams('"a" "a"', 'c')).toEqual(['"a"', '"a"']);
});

test('mixture', () => {
  expect(parseActualParams('\'a\' "a" `a` a', 'c')).toEqual([
    "'a'",
    '"a"',
    '`a`',
    'c.a',
  ]);
  expect(parseActualParams('\',\' "," `,` a', 'c')).toEqual([
    "','",
    '","',
    '`,`',
    'c.a',
  ]);
});
