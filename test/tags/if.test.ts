import { describe, expect, test } from 'vitest';
import { parse } from '../__helper';
import { IfTag } from '../../src/tags';
import { TemplateOptions } from '../../src/types';

const _parse = (input: string, options?: TemplateOptions) =>
  parse(input, options, [IfTag]);

describe('validation', () => {
  test('start and end tag mismatched', () => {
    expect(() => _parse('{{ for x in y }}{{ endif }}')).toMatchSnapshot();
    expect(() =>
      _parse('{{ for x in y }}{{ endif }}', { debug: true }),
    ).toThrowErrorMatchingSnapshot();
    expect(() => {
      try {
        _parse('{{ for x in y }}{{ endif }}', { debug: true });
      } catch (error: any) {
        throw new Error(error.details);
      }
    }).toThrowErrorMatchingSnapshot();
  });

  test('start and end tag mismatched', () => {
    expect(() => _parse('{{ for x in y }}{{ elif z }}')).toMatchSnapshot();
    expect(() =>
      _parse('{{ for x in y }}{{ elif z }}', { debug: true }),
    ).toThrowErrorMatchingSnapshot();
    expect(() => {
      try {
        _parse('{{ for x in y }}{{ elif z }}', { debug: true });
      } catch (error: any) {
        throw new Error(error.details);
      }
    }).toThrowErrorMatchingSnapshot();
  });
});

test('basic', () => {
  expect(_parse(`{{ if name }}{{ name }}{{ /if }}`)).toMatchSnapshot();
  expect(_parse(`{{ if name }}{{ name }}{{ endif }}`)).toMatchSnapshot();
});

test('not', () => {
  expect(_parse(`{{ if not name }}{{ name }}{{ endif }}`)).toMatchSnapshot();
  expect(_parse(`{{ if !name }}{{ name }}{{ endif }}`)).toMatchSnapshot();
});

test('in', () => {
  expect(
    _parse(`{{ if name in names }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    _parse(`{{ if name in ["foo", "bar"] }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('includes', () => {
  expect(
    _parse(`{{ if names includes name }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    _parse(`{{ if ["foo", "bar"] includes name }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('equal', () => {
  expect(
    _parse(`{{ if name eq other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    _parse(`{{ if name == other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    _parse(`{{ if name === other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    _parse(`{{ if name == "foo" }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('not equal', () => {
  expect(
    _parse(`{{ if name ne other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    _parse(`{{ if name != other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    _parse(`{{ if name !== other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    _parse(`{{ if name != "foo" }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('else', () => {
  expect(
    _parse(`{{ if name }}{{ name }}{{ else }}{{ "*" }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('elif', () => {
  expect(
    _parse(
      `{{ if name == "foo" }}>>>{{ elif name == "bar" }}---{{ elif name == "baz" }}...{{ else }}{{ name }}{{ endif }}`,
    ),
  ).toMatchSnapshot();
});

describe('filter', () => {
  test('basic', () => {
    expect(
      _parse(`{{ if name | length }}{{ name }}{{ endif }}`),
    ).toMatchSnapshot();
  });

  test('multiple', () => {
    expect(
      _parse(`{{ if name | length | odd }}{{ name }}{{ endif }}`),
    ).toMatchSnapshot();
  });

  test('w/ args', () => {
    expect(
      _parse(`{{ if names | join "" == "foobar" }}yes{{ endif }}`),
    ).toMatchSnapshot();
  });
});
