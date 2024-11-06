import { describe, expect, test } from 'vitest';
import { parse } from './__helper';

describe('collapseWhitespace', () => {
  test('on', () => {
    expect(
      parse(
        `{{ for name in names }}
  {{ name }} in {{ names }}
{{ endfor }}`,
      ),
    ).toMatchSnapshot();
  });

  test('off', () => {
    expect(
      parse(
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
    expect(parse(`{{ ! this is a comment }}`)).toMatchSnapshot();
  });

  test('off', () => {
    expect(
      parse(`{{ ! this is a comment }}`, {
        stripComments: false,
      }),
    ).toMatchSnapshot();
  });
});

describe('strictMode', () => {
  test('on', () => {
    expect(parse(``)).toMatchSnapshot();
  });
  test('off', () => {
    expect(
      parse(``, {
        strictMode: false,
      }),
    ).toMatchSnapshot();
  });
});

test('tagStart and tagEnd', () => {
  expect(
    parse(`{% for name in names %}{{ name }} in {{ names }}{% endfor %}`, {
      tagStart: '{%',
      tagEnd: '%}',
    }),
  ).toMatchSnapshot();
});
