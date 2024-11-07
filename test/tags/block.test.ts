import { describe, expect, test } from 'vitest';
import { parse } from '../__helper';
import { BlockTag, IfTag } from '../../src/tags';
import { TemplateOptions } from '../../src/types';

const _parse = (input: string, options?: TemplateOptions) =>
  parse(input, options, [IfTag, BlockTag]);

describe('validation', () => {
  test('super() should only be a child of block', () => {
    expect(() =>
      _parse('{{ if x }}{{ super() }}{{ endif }}'),
    ).toMatchSnapshot();
    expect(() =>
      _parse('{{ if x }}{{ super() }}{{ endif }}', { debug: true }),
    ).toThrowErrorMatchingSnapshot();
    expect(() => {
      try {
        _parse('{{ if x }}{{ super() }}{{ endif }}', { debug: true });
      } catch (error: any) {
        throw new Error(error.details);
      }
    }).toThrowErrorMatchingSnapshot();
  });
});

test('basic', () => {
  expect(
    _parse(
      `{{ block title }}1{{ endblock }}{{ block title }}2{{ endblock }}{{ block title }}{{ super() }}3{{ endblock }}`,
    ),
  ).toMatchSnapshot();
});

test('block tag should be at the root level', () => {
  expect(() =>
    _parse('{{ if x }}{{ block title }}{{ endblock }}{{ endif }}', {
      debug: true,
    }),
  ).toThrowErrorMatchingInlineSnapshot(
    `[ASTError: "block" must follow "root", not "if".]`,
  );
});
