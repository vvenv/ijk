import { expect, test } from 'vitest';
import { parse } from './__helper';

test('for -> if', () => {
  expect(
    parse(
      `{{ for name in names }}{{ if name }}{{ name }}{{ endif }}{{ endfor }}`,
    ),
  ).toMatchSnapshot();
});

test('if -> for', () => {
  expect(
    parse(
      `{{ if names }}{{ for name in names }}{{ name }}{{ endfor }}{{ endif }}`,
    ),
  ).toMatchSnapshot();
});

test('if -> for -> if', () => {
  expect(
    parse(
      `{{ if name }}{{ for name in names }}{{ if name }}{{ name }}{{ endif }}{{ endfor }}{{ endif }}`,
    ),
  ).toMatchSnapshot();
});

test('for -> if/else ', () => {
  expect(
    parse(
      `{{ for name in names }}{{ if name }}{{ name }}{{ else }}***{{ endif }}{{ endfor }}`,
    ),
  ).toMatchSnapshot();
});

test('for -> if/else - literal', () => {
  expect(
    parse(
      `{{ for name in names }}{{ if name }}{{ name }}{{ else }}{{ "***" }}{{ endif }}{{ endfor }}`,
    ),
  ).toMatchSnapshot();
});
