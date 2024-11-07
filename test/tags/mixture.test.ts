import { expect, test } from 'vitest';
import { parse } from '../__helper';
import { ForTag, IfTag } from '../../src/tags';
import { TemplateOptions } from '../../src/types';

const _parse = (input: string, options?: TemplateOptions) =>
  parse(input, options, [IfTag, ForTag]);

test('for -> if', () => {
  expect(
    _parse(
      `{{ for name in names }}{{ if name }}{{ name }}{{ endif }}{{ endfor }}`,
    ),
  ).toMatchSnapshot();
});

test('if -> for', () => {
  expect(
    _parse(
      `{{ if names }}{{ for name in names }}{{ name }}{{ endfor }}{{ endif }}`,
    ),
  ).toMatchSnapshot();
});

test('if -> for -> if', () => {
  expect(
    _parse(
      `{{ if name }}{{ for name in names }}{{ if name }}{{ name }}{{ endif }}{{ endfor }}{{ endif }}`,
    ),
  ).toMatchSnapshot();
});

test('for -> if/else ', () => {
  expect(
    _parse(
      `{{ for name in names }}{{ if name }}{{ name }}{{ else }}***{{ endif }}{{ endfor }}`,
    ),
  ).toMatchSnapshot();
});

test('for -> if/else - literal', () => {
  expect(
    _parse(
      `{{ for name in names }}{{ if name }}{{ name }}{{ else }}{{ "***" }}{{ endif }}{{ endfor }}`,
    ),
  ).toMatchSnapshot();
});

test('tag mismatch', () => {
  expect(parse('{{ for i in j }}{{ endif }}')).toMatchSnapshot();
  expect(parse('{{ for i in j }}1{{ elif }}2{{ endfor }}')).toMatchSnapshot();
});

test('no tag', () => {
  expect(parse('{{}}')).toMatchSnapshot();
});
