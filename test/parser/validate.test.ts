import { expect, test } from 'vitest';
import { parse } from './__helper';

test('tag mismatch', () => {
  expect(parse('{{ for i in j }}{{ endif }}')).toMatchSnapshot();
  expect(parse('{{ for i in j }}1{{ elif }}2{{ endfor }}')).toMatchSnapshot();
});

test('no tag', () => {
  expect(parse('{{}}')).toMatchSnapshot();
});
