import { describe, expect, test } from 'vitest';
import { parse } from '../__helper';
import { ForTag } from '../../src/tags';
import { TemplateOptions } from '../../src/types';

const _parse = (input: string, options?: TemplateOptions) =>
  parse(input, options, [ForTag]);

describe('validation', () => {
  test('start and end tag mismatched', () => {
    expect(() => _parse('{{ if x }}{{ endfor }}')).toMatchSnapshot();
    expect(() =>
      _parse('{{ if x }}{{ endfor }}', { debug: true }),
    ).toThrowErrorMatchingSnapshot();
    expect(() => {
      try {
        _parse('{{ if x }}{{ endfor }}', { debug: true });
      } catch (error: any) {
        throw new Error(error.details);
      }
    }).toThrowErrorMatchingSnapshot();
  });
});

describe('for - array', () => {
  test('basic', () => {
    expect(
      _parse(
        `{{ names }}{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}{{ names }}`,
      ),
    ).toMatchSnapshot();
  });

  test('destructuring', () => {
    expect(
      _parse(`{{ for x y z in a }}{{ x }},{{ y }},{{ z }}{{ endfor }}`),
    ).toMatchSnapshot();
  });

  test.skip('constructing', () => {
    expect(
      _parse(`{{ for x in [a, b, c] }}{{ x }}{{ endfor }}`),
    ).toMatchSnapshot();
  });

  test('duo', () => {
    expect(
      _parse(
        `{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('nesting', () => {
    expect(
      _parse(
        `{{ for as in ass }}{{ for a in as }}{{ a }} in {{ as }} in {{ ass }}{{ endfor }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('loop.index', () => {
    expect(
      _parse(
        `{{ for name in names }}{{loop.index+1}} {{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('else', () => {
    expect(
      _parse(`{{ for name in names }}{{ name }}{{ else }}empty{{ endfor }}`),
    ).toMatchSnapshot();
  });

  test('filter', () => {
    expect(
      _parse(
        `{{ for name in names | split }}{{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('filter w/ args', () => {
    expect(
      _parse(
        `{{ for char in name | split "" }}{{ char }} in {{ name }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });
});

describe('for - object', () => {
  test('basic', () => {
    expect(
      _parse(
        `{{ names }}{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}{{ names }}`,
      ),
    ).toMatchSnapshot();
  });

  test('destructuring', () => {
    expect(
      _parse(`{{ for k v in a }}{{ k }}:{{ v }}{{ endfor }}`),
    ).toMatchSnapshot();
  });

  test('duo', () => {
    expect(
      _parse(
        `{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}{{ for name in names }}{{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('nesting', () => {
    expect(
      _parse(
        `{{ for as in ass }}{{ for a in as }}{{ a }} in {{ as }} in {{ ass }}{{ endfor }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('loop.index', () => {
    expect(
      _parse(
        `{{ for name in names }}{{loop.index+1}} {{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('else', () => {
    expect(
      _parse(`{{ for name in names }}{{ name }}{{ else }}empty{{ endfor }}`),
    ).toMatchSnapshot();
  });

  test('filter', () => {
    expect(
      _parse(
        `{{ for name in names | split }}{{ name }} in {{ names }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('filter w/ args', () => {
    expect(
      _parse(
        `{{ for char in name | split "" }}{{ char }} in {{ name }}{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });
});
