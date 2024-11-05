import { describe, expect, test } from 'vitest';
import { parse } from './__helper';

describe('validation', () => {
  test('start and end tag mismatched', () => {
    expect(() => parse('{{ for x in y }}{{ endif }}')).toMatchSnapshot();
    expect(() =>
      parse('{{ for x in y }}{{ endif }}', { debug: true }),
    ).toThrowErrorMatchingSnapshot();
    expect(() => {
      try {
        parse('{{ for x in y }}{{ endif }}', { debug: true });
      } catch (error: any) {
        throw new Error(error.details);
      }
    }).toThrowErrorMatchingSnapshot();
  });

  test('start and end tag mismatched', () => {
    expect(() => parse('{{ for x in y }}{{ elif z }}')).toMatchSnapshot();
    expect(() =>
      parse('{{ for x in y }}{{ elif z }}', { debug: true }),
    ).toThrowErrorMatchingSnapshot();
    expect(() => {
      try {
        parse('{{ for x in y }}{{ elif z }}', { debug: true });
      } catch (error: any) {
        throw new Error(error.details);
      }
    }).toThrowErrorMatchingSnapshot();
  });
});

test('basic', () => {
  expect(parse(`{{ if name }}{{ name }}{{ /if }}`)).toMatchSnapshot();
  expect(parse(`{{ if name }}{{ name }}{{ endif }}`)).toMatchSnapshot();
});

test('not', () => {
  expect(parse(`{{ if not name }}{{ name }}{{ endif }}`)).toMatchSnapshot();
  expect(parse(`{{ if !name }}{{ name }}{{ endif }}`)).toMatchSnapshot();
});

test('in', () => {
  expect(
    parse(`{{ if name in names }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    parse(`{{ if name in ["foo", "bar"] }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('includes', () => {
  expect(
    parse(`{{ if names includes name }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    parse(`{{ if ["foo", "bar"] includes name }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('equal', () => {
  expect(
    parse(`{{ if name eq other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    parse(`{{ if name == other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    parse(`{{ if name === other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    parse(`{{ if name == "foo" }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('not equal', () => {
  expect(
    parse(`{{ if name ne other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    parse(`{{ if name != other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    parse(`{{ if name !== other }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
  expect(
    parse(`{{ if name != "foo" }}{{ name }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('else', () => {
  expect(
    parse(`{{ if name }}{{ name }}{{ else }}{{ "*" }}{{ endif }}`),
  ).toMatchSnapshot();
});

test('elif', () => {
  expect(
    parse(
      `{{ if name == "foo" }}>>>{{ elif name == "bar" }}---{{ elif name == "baz" }}...{{ else }}{{ name }}{{ endif }}`,
    ),
  ).toMatchSnapshot();
});

describe('filter', () => {
  test('basic', () => {
    expect(
      parse(`{{ if name | length }}{{ name }}{{ endif }}`),
    ).toMatchSnapshot();
  });

  test('multiple', () => {
    expect(
      parse(`{{ if name | length | odd }}{{ name }}{{ endif }}`),
    ).toMatchSnapshot();
  });

  test('w/ params', () => {
    expect(
      parse(`{{ if names | join "" == "foobar" }}yes{{ endif }}`),
    ).toMatchSnapshot();
  });
});
