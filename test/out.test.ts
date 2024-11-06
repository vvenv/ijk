import { describe, expect, test } from 'vitest';
import { Out } from '../src/out';
import { TemplateOptions } from '../src/types';

describe('collapse whitespace', () => {
  test('on', () => {
    const out = new Out({
      collapseWhitespace: true,
    } as Required<TemplateOptions>);
    out.pushStr(`  <foo>
     <bar/> \t </foo>  `);
    expect(out.value).toMatchInlineSnapshot(
      `"let s="";s+=" <foo> <bar/> </foo> ";"`,
    );
  });

  test('off', () => {
    const out = new Out({} as Required<TemplateOptions>);
    out.pushStr(`  <foo>
     <bar/> \t </foo>  `);
    expect(out.value).toMatchInlineSnapshot(
      `"let s="";s+="  <foo>\\n     <bar/> 	 </foo>  ";"`,
    );
  });
});

test('escape static values: \\, \\n, and "', () => {
  const out = new Out({
    collapseWhitespace: true,
  } as Required<TemplateOptions>);
  out.pushStr(`\\\n\"`);
  expect(out.value).toMatchInlineSnapshot(`"let s="";s+="\\\\ \\"";"`);
});

test('escape dynamic values with external function', () => {
  const out = new Out({} as Required<TemplateOptions>);
  out.pushVar('x');
  expect(out.value).toMatchInlineSnapshot(`"let s="";s+=e(x);"`);
});
