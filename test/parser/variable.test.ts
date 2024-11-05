import { describe, expect, test } from 'vitest';
import { parse } from './__helper';

test('basic', () => {
  expect(parse('{{ x }}')).toMatchSnapshot();
  expect(parse('{{= x }}')).toMatchSnapshot();
});

test('multiple', () => {
  expect(parse('{{ x }} and {{ y }}')).toMatchSnapshot();
});

test('duo', () => {
  expect(parse('{{ x }} and {{ x }}')).toMatchSnapshot();
});

test('nesting', () => {
  expect(parse('{{ x }}{{ x.y }}{{ x.y.z }}')).toMatchSnapshot();
});

describe('literal', () => {
  test('string', () => {
    expect(parse('{{ "*" }}')).toMatchSnapshot();
  });

  test('number', () => {
    expect(parse('{{ 1314 }}')).toMatchSnapshot();
    expect(parse('{{ 13.14 }}')).toMatchSnapshot();
  });

  test('boolean', () => {
    expect(parse('{{ true }}')).toMatchSnapshot();
    expect(parse('{{ false }}')).toMatchSnapshot();
  });

  test('array', () => {
    expect(parse('{{ [1, "1"] }}')).toMatchSnapshot();
  });

  test('object', () => {
    expect(parse('{{ { x: 1 } }}')).toMatchSnapshot();
  });

  test.skip('regexp', () => {
    expect(parse('{{ /\\d+/ }}')).toMatchSnapshot();
    expect(parse('{{ /{{.+?}}/gms }}')).toMatchSnapshot();
  });
});

describe('filter', () => {
  test('basic', () => {
    expect(parse('{{ x | upper }}')).toMatchSnapshot();
  });

  test('multiple', () => {
    expect(parse('{{ x | upper | lower }}')).toMatchSnapshot();
  });

  test('duo', () => {
    expect(parse('{{ x | upper }} and {{ x | upper }}')).toMatchSnapshot();
  });

  test('safe', () => {
    expect(parse('{{ x | safe }}')).toMatchSnapshot();
  });

  test('w/ params', () => {
    expect(parse(`{{ name | split "" }}`)).toMatchSnapshot();
  });
});

describe('expression', () => {
  test('arithmetic', () => {
    expect(
      parse('{{ x+2 }}{{ x-2 }}{{ x*2 }}{{ x/2 }}{{ x**2 }}'),
    ).toMatchSnapshot();
  });

  test('array/object member', () => {
    expect(parse('{{ x[2] }}{{ y["foo"] }}{{ z.bar }}')).toMatchSnapshot();
  });
});
