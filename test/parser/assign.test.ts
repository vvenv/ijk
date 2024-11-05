import { expect, test } from 'vitest';
import { parse } from './__helper';

test('basic', () => {
  expect(parse(`{{ assign x = y }}{{ x }} = {{ y }}`)).toMatchSnapshot();
});

test('destructuring', () => {
  expect(
    parse(`{{ assign x,y,z = a }}{{ x }},{{ y }},{{ z }}`),
  ).toMatchSnapshot();
});

test('duo', () => {
  expect(
    parse(`{{ assign x = 'y' }}{{ x }}{{ assign x = "y" }}{{ x }}`),
  ).toMatchSnapshot();
});

test('nesting', () => {
  expect(
    parse(`{{ assign x = y }}{{ assign z = x }}{{ x }} = {{ y }} = {{ z }}`),
  ).toMatchSnapshot();
});

test('filter', () => {
  expect(
    parse(`{{ assign x = y | split }}{{ x }} from {{ y }}`),
  ).toMatchSnapshot();
});

test('filter w/ params', () => {
  expect(
    parse(`{{ assign char = name | split "" }}{{ char }} from {{ name }}`),
  ).toMatchSnapshot();
});
