import { describe, expect, test } from 'vitest';
import { parse } from './__helper';

describe('validation', () => {
  test('start and end tag mismatched', () => {
    expect(() => parse('{{ if x }}{{ endfor }}')).toMatchSnapshot();
    expect(() =>
      parse('{{ if x }}{{ endfor }}', { debug: true }),
    ).toThrowErrorMatchingSnapshot();
    expect(() => {
      try {
        parse('{{ if x }}{{ endfor }}', { debug: true });
      } catch (error: any) {
        throw new Error(error.details);
      }
    }).toThrowErrorMatchingSnapshot();
  });
});

describe('for - array', () => {
  test('basic', () => {
    expect(
      parse(
        `{{ names }}{{ for name of names }}{{ name }} of {{ names }}{{ endfor }}{{ names }}`,
      ),
    ).toMatchSnapshot();
  });

  test('destructuring', () => {
    expect(
      parse(`{{ for x,y,z of a }}{{ x }},{{ y }},{{ z }}{{ endfor }}`),
    ).toMatchSnapshot();
  });

  test('duo', () => {
    expect(
      parse(
        `{{ for name of names }}{{ name }} of {{ names }}{{ endfor }}{{ for name of names }}{{ name }} of {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('nesting', () => {
    expect(
      parse(
        `{{ for as of ass }}{{ for a of as }}{{ a }} of {{ as }} of {{ ass }}{{ endfor }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('loop.index', () => {
    expect(
      parse(
        `{{ for name of names }}{{loop.index+1}} {{ name }} of {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('else', () => {
    expect(
      parse(`{{ for name of names }}{{ name }}{{ else }}empty{{ endfor }}`),
    ).toMatchSnapshot();
  });

  test('filter', () => {
    expect(
      parse(
        `{{ for name of names | split }}{{ name }} of {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('filter w/ params', () => {
    expect(
      parse(
        `{{ for char of name | split "" }}{{ char }} of {{ name }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });
});

describe('for - object', () => {
  test('basic', () => {
    expect(
      parse(
        `{{ names }}{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}{{ names }}`,
      ),
    ).toMatchSnapshot();
  });

  test('duo', () => {
    expect(
      parse(
        `{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('nesting', () => {
    expect(
      parse(
        `{{ for as in ass }}{{ for a in as }}{{ a }} in {{ as }} in {{ ass }}{{ endfor }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('loop.index', () => {
    expect(
      parse(
        `{{ for name in names }}{{loop.index+1}} {{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('else', () => {
    expect(
      parse(`{{ for name in names }}{{ name }}{{ else }}empty{{ endfor }}`),
    ).toMatchSnapshot();
  });

  test('filter', () => {
    expect(
      parse(
        `{{ for name in names | split }}{{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('filter w/ params', () => {
    expect(
      parse(
        `{{ for char in name | split "" }}{{ char }} in {{ name }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });
});
