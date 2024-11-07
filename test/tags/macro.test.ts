import { expect, test } from 'vitest';
import { parse } from '../__helper';
import { MacroTag } from '../../src/tags';
import { TemplateOptions } from '../../src/types';

const _parse = (input: string, options?: TemplateOptions) =>
  parse(input, options, [MacroTag]);

test('basic', () => {
  expect(
    _parse(`{{ macro name x y }}{{x}}{{y}}{{ endmacro }}{{ name(1, 2) }}`),
  ).toMatchSnapshot();
});

test('default args', () => {
  expect(
    _parse(
      `{{ macro name x="foo" y=123 }}{{x}}{{y}}{{ endmacro }}{{ name() }}`,
    ),
  ).toMatchSnapshot();
});

test('call', () => {
  expect(
    _parse(
      `{{ macro name foo bar }}{{foo}}{{caller()}}{{bar}}{{ endmacro }}{{ call name 1 2 }}3{{ endcall }}`,
    ),
  ).toMatchSnapshot();
});
