import { describe, expect, test } from 'vitest';
import { parse } from './__helper';

describe('trimWhitespace', () => {
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
          trimWhitespace: false,
        },
      ),
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
