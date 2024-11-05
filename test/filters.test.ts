import { describe, expect, test } from 'vitest';
import { Template } from '../src/template';

describe('builtin', () => {
  test('abs', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | abs }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"NaN"`);
    expect(
      new Template({ debug: true })
        .compile('{{ x | abs }}')
        .render({ x: -Infinity }),
    ).toMatchInlineSnapshot(`"Infinity"`);
    expect(
      new Template({ debug: true }).compile('{{ x | abs }}').render({ x: -3 }),
    ).toMatchInlineSnapshot(`"3"`);
  });

  test('capitalize', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | capitalize }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"Foo"`);
  });

  test('date', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | date }}')
        .render({ x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"2021-01-01T00:00:00.000Z"`);
  });

  test('entries', () => {
    expect(
      new Template({ debug: true }).compile('{{ x | entries }}').render({
        x: { foo: 1, bar: 2 },
      }),
    ).toMatchInlineSnapshot(`"foo,1,bar,2"`);
  });

  test('escape', () => {
    expect(
      new Template({ debug: true, autoEscape: false })
        .compile('{{ x }}')
        .render({ x: '<x>x</x>' }),
    ).toMatchInlineSnapshot(`"<x>x</x>"`);
    expect(
      new Template({ debug: true, autoEscape: false })
        .compile('{{ x | escape }}')
        .render({ x: '<x>x</x>' }),
    ).toMatchInlineSnapshot(`"&amp;lt;x&amp;gt;x&amp;lt;/x&amp;gt;"`);
  });

  test('even', () => {
    expect(
      new Template({ debug: true }).compile('{{ x | even }}').render({ x: 2 }),
    ).toMatchInlineSnapshot(`"true"`);
  });

  test('first', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | first }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"f"`);
    expect(
      new Template({ debug: true })
        .compile('{{ x | first }}')
        .render({ x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"foo"`);
  });

  test('join', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | join "-" }}')
        .render({ x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"foo-bar"`);
  });

  test('json', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | json }}')
        .render({ x: { foo: '<bar>' } }),
    ).toMatchInlineSnapshot(`"{&#34;foo&#34;:&#34;&amp;lt;bar&amp;gt;&#34;}"`);
  });

  test('keys', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | keys }}')
        .render({ x: { foo: 1, bar: 2 } }),
    ).toMatchInlineSnapshot(`"foo,bar"`);
  });

  test('last', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | last }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"o"`);
    expect(
      new Template({ debug: true })
        .compile('{{ x | last }}')
        .render({ x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"bar"`);
  });

  test('length', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | length }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"3"`);
  });

  test('lower', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | lower }}')
        .render({ x: 'FOO' }),
    ).toMatchInlineSnapshot(`"foo"`);
  });

  test('odd', () => {
    expect(
      new Template({ debug: true }).compile('{{ x | odd }}').render({ x: 1 }),
    ).toMatchInlineSnapshot(`"true"`);
  });

  test('repeat', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | repeat 2 }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"foofoo"`); // cspell: disable-line
  });

  test('replace', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | replace "o" "a" }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"faa"`);
  });

  test('reverse', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | reverse }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"oof"`);
  });

  test('safe', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x }}')
        .render({ x: '<x>x</x>' }),
    ).toMatchInlineSnapshot(`"&amp;lt;x&amp;gt;x&amp;lt;/x&amp;gt;"`);
    expect(
      new Template({ debug: true })
        .compile('{{ x | safe }}')
        .render({ x: '<x>x</x>' }),
    ).toMatchInlineSnapshot(`"<x>x</x>"`);
  });

  test('slice', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | slice 1 }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"oo"`);
    expect(
      new Template({ debug: true })
        .compile('{{ x | slice 1 2 }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"o"`);
  });

  test('sort', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | sort }}')
        .render({ x: 'bar' }),
    ).toMatchInlineSnapshot(`"abr"`);
    expect(
      new Template({ debug: true })
        .compile('{{ x | sort }}')
        .render({ x: ['foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"bar,foo"`);
  });

  test('split', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | split "," }}')
        .render({ x: 'foo,bar' }),
    ).toMatchInlineSnapshot(`"foo,bar"`);
  });

  test('sum', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | sum }}')
        .render({ x: [1, 2, 3] }),
    ).toMatchInlineSnapshot(`"6"`);
  });

  test('time', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | time }}')
        .render({ x: '2021-01-01' }),
    ).toMatchInlineSnapshot(`"1609459200000"`);
  });

  test('trim', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | trim }}')
        .render({ x: ' foo ' }),
    ).toMatchInlineSnapshot(`"foo"`);
  });

  test('unique', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | unique }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"fo"`);
    expect(
      new Template({ debug: true })
        .compile('{{ x | unique }}')
        .render({ x: ['foo', 'foo', 'bar'] }),
    ).toMatchInlineSnapshot(`"foo,bar"`);
  });

  test('upper', () => {
    expect(
      new Template({ debug: true })
        .compile('{{ x | upper }}')
        .render({ x: 'foo' }),
    ).toMatchInlineSnapshot(`"FOO"`);
  });

  test('values', () => {
    expect(
      new Template({ debug: true }).compile('{{ x | values }}').render({
        x: { foo: 1, bar: 2 },
      }),
    ).toMatchInlineSnapshot(`"1,2"`);
  });
});

describe('custom', () => {
  test('camel', () => {
    expect(
      new Template({ debug: true })
        .registerFilter('camel', (value: string) =>
          value.replace(/-(\w)/g, (_, c) => c.toUpperCase()),
        )
        .compile('{{ x | camel }}')
        .render({ x: 'foo-bar' }),
    ).toMatchInlineSnapshot(`"fooBar"`);
  });
});
