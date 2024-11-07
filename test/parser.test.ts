import { describe, expect, test } from 'vitest';
import { parse } from './__helper';
import { CommentTag, ForTag } from '../src/tags';
import { TemplateOptions } from '../src/types';

const _parse = (input: string, options?: TemplateOptions) =>
  parse(input, options, [ForTag, CommentTag]);

describe('collapseWhitespace', () => {
  test('on', () => {
    expect(
      _parse(
        `{{ for name in names }}
  {{ name }} in {{ names }}
{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('off', () => {
    expect(
      _parse(
        ` {{ for name  in names }}
  {{ name }} in  {{ names }}
 {{ endfor  }} `,
        {
          collapseWhitespace: false,
        },
      ),
    ).toMatchSnapshot();
  });
});

describe('stripComments', () => {
  test('on', () => {
    expect(_parse(`{{ ! this is a comment }}`)).toMatchSnapshot();
  });

  test('off', () => {
    expect(
      _parse(`{{ ! this is a comment }}`, {
        stripComments: false,
      }),
    ).toMatchSnapshot();
  });
});

describe('strictMode', () => {
  test('on', () => {
    expect(_parse(``)).toMatchSnapshot();
  });
  test('off', () => {
    expect(
      _parse(``, {
        strictMode: false,
      }),
    ).toMatchSnapshot();
  });
});

test('tagStart and tagEnd', () => {
  expect(
    _parse(`{% for name in names %}{{ name }} in {{ names }}{% endfor %}`, {
      tagStart: '{%',
      tagEnd: '%}',
    }),
  ).toMatchSnapshot();
});

test('empty', () => {
  expect(_parse(``)).toMatchSnapshot();
});

test('html tags', () => {
  expect(_parse(`<foo>foo</foo>`)).toMatchSnapshot();
});

test('quotes', () => {
  expect(_parse(`"'foo'"`)).toMatchSnapshot();
});

test('line break feed', () => {
  expect(_parse(`\nfoo\n`)).toMatchSnapshot();
});
