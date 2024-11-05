import { expect, test } from 'vitest';
import { parse } from './__helper';

test('basic', () => {
  expect(
    parse(`{{ macro name x y }}{{x}}{{y}}{{ endmacro }}{{ name(1, 2) }}`),
  ).toMatchInlineSnapshot(
    `""use strict";let s="";c.name=(x,y,_c)=>{const c_m_1_0={...c,x,y,};s+=e(c_m_1_0.x);s+=e(c_m_1_0.y);};s+=e(c.name(1, 2));return s;"`,
  );
});

test('default params', () => {
  expect(
    parse(`{{ macro name x="foo" y=123 }}{{x}}{{y}}{{ endmacro }}{{ name() }}`),
  ).toMatchInlineSnapshot(
    `""use strict";let s="";c.name=(x="foo",y=123,_c)=>{const c_m_1_0={...c,x,y,};s+=e(c_m_1_0.x);s+=e(c_m_1_0.y);};s+=e(c.name());return s;"`,
  );
});

test('call', () => {
  expect(
    parse(
      `{{ macro name foo bar }}{{foo}}{{caller()}}{{bar}}{{ endmacro }}{{ call name 1 2 }}3{{ endcall }}`,
    ),
  ).toMatchInlineSnapshot(
    `""use strict";let s="";c.name=(foo,bar,_c)=>{const c_m_1_0={...c,foo,bar,};s+=e(c_m_1_0.foo);_c?.();s+=e(c_m_1_0.bar);};c.name(1,2,()=>{s+="3";});return s;"`,
  );
});
