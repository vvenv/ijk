import { expect, test } from 'vitest';
import { parse } from '../__helper';

test('basic', () => {
  expect(parse('{{ > }}')).toMatchSnapshot();
  expect(parse('{{ < }}')).toMatchSnapshot();
  expect(parse('{{ alert("XSS") }}')).toMatchSnapshot();
  expect(parse('{{ window.alert("XSS") }}')).toMatchSnapshot();
});
