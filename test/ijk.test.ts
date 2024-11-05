import { describe, expect, test } from 'vitest';
import { Template } from '../src/template';
import { TemplateOptions } from '../src/types';

const render = (template: string, context: object, options?: TemplateOptions) =>
  new Template({
    debug: true,
    ...options,
  })
    .compile(template)
    .render(context);

test('cache', () => {});

describe('options', () => {
  describe('autoEscape', () => {
    test('on', () => {
      expect(
        render(
          `"
{{ x }}
<>`,
          { x: '<foo></foo>' },
        ),
      ).toMatchSnapshot();
    });

    test('off', () => {
      expect(
        render(
          `"
{{ x }}
<>`,
          { x: '<foo></foo>' },
          {
            autoEscape: false,
          },
        ),
      ).toMatchSnapshot();
    });
  });
});

test('interpolate', () => {
  expect(render('{{ name }}', { name: 'foo' })).toMatchSnapshot();
  expect(
    render('{{ name }} and {{ name }}', { name: 'foo' }),
  ).toMatchSnapshot();
  expect(render('{{ "*" }}', {})).toMatchSnapshot();
});

test('for loop', () => {
  expect(
    render('{{ for name in names }}{{ name }}{{ endfor }}', {
      names: ['foo', 'bar'],
    }),
  ).toMatchSnapshot();

  expect(
    render(
      `{{ for name in names }}
  {{ name }}
{{ endfor }}`,
      {
        names: ['foo', 'bar'],
      },
    ),
  ).toMatchSnapshot();
});

test('for loop - nested', () => {
  expect(
    render(
      `{{ for as in ass }}{{ for a in as }}|{{ a }} in {{ as }} in {{ ass }}|{{ endfor }}{{ endfor }}`,
      {
        ass: ['foo', 'bar'],
      },
    ),
  ).toMatchSnapshot();
});

test('if - else', () => {
  expect(
    render(`{{ if name }}{{ name }}{{ else }}{{ "*" }}{{ endif }}`, {
      name: 'foo',
    }),
  ).toMatchSnapshot();
  expect(
    render(`{{ if name }}{{ name }}{{ else }}{{ "*" }}{{ endif }}`, {}),
  ).toMatchSnapshot();
});

test('mixed', () => {
  expect(
    render(
      `{{ for name in names }}{{ if name }}{{ name }}{{ else }}{{ "*" }}{{ endif }}{{ endfor }}`,
      {
        names: ['foo', '', 'bar'],
      },
    ),
  ).toMatchSnapshot();
});
