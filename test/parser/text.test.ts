import { expect, test } from 'vitest';
import { parse } from './__helper';

test('empty', () => {
  expect(parse(``)).toMatchSnapshot();
});

test('html tags', () => {
  expect(parse(`<foo>foo</foo>`)).toMatchSnapshot();
});

test('quotes', () => {
  expect(parse(`"'foo'"`)).toMatchSnapshot();
});

test('line break feed', () => {
  expect(parse(`\nfoo\n`)).toMatchSnapshot();
});
