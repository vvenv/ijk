import { expect, test } from 'vitest';
import { parse } from './__helper';

test('basic', () => {
  expect(
    parse(`{{ macro name x y }}{{x}}{{y}}{{ endmacro }}{{ name(1, 2) }}`),
  ).toMatchSnapshot();
});

test('default params', () => {
  expect(
    parse(`{{ macro name x="foo" y=123 }}{{x}}{{y}}{{ endmacro }}{{ name() }}`),
  ).toMatchSnapshot();
});

test.skip('call', () => {
  expect(
    parse(
      `{{ macro name foo bar }}{{foo}}{{bar}}{{ endmacro }}{{ call name(1, 2) }}3{{ endcall }}`,
    ),
  ).toMatchSnapshot();
});
