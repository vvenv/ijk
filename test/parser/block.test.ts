import { describe, expect, test } from 'vitest';
import { parse } from './__helper';

describe('validation', () => {
  test('super() should only be a child of block', () => {
    expect(() => parse('{{ if x }}{{ super() }}{{ endif }}')).toMatchSnapshot();
    expect(() =>
      parse('{{ if x }}{{ super() }}{{ endif }}', { debug: true }),
    ).toThrowErrorMatchingSnapshot();
    expect(() => {
      try {
        parse('{{ if x }}{{ super() }}{{ endif }}', { debug: true });
      } catch (error: any) {
        throw new Error(error.details);
      }
    }).toThrowErrorMatchingSnapshot();
  });
});

test('basic', () => {
  expect(
    parse(
      `{{ block title }}1{{ endblock }}{{ block title }}2{{ endblock }}{{ block title }}{{ super() }}3{{ endblock }}`,
    ),
  ).toMatchSnapshot();
});

test('block tag should be at the root level', () => {
  expect(() =>
    parse('{{ if x }}{{ block title }}{{ endblock }}{{ endif }}', {
      debug: true,
    }),
  ).toThrowErrorMatchingInlineSnapshot(
    `[ASTError: "block" must follow "root", not "if".]`,
  );
});
