import { expect, test } from 'vitest';
import { parse } from '../__helper';
import { AssignTag } from '../../src/tags';

const _parse = (input: string) => parse(input, {}, [AssignTag]);

test('basic', () => {
  expect(_parse(`{{ assign x = y }}{{ x }} = {{ y }}`)).toMatchSnapshot();
});

test('destructuring', () => {
  expect(
    _parse(`{{ assign x,y,z = a }}{{ x }},{{ y }},{{ z }}`),
  ).toMatchSnapshot();
});

test('duo', () => {
  expect(
    _parse(`{{ assign x = 'y' }}{{ x }}{{ assign x = "y" }}{{ x }}`),
  ).toMatchSnapshot();
});

test('nesting', () => {
  expect(
    _parse(`{{ assign x = y }}{{ assign z = x }}{{ x }} = {{ y }} = {{ z }}`),
  ).toMatchSnapshot();
});

test('filter', () => {
  expect(
    _parse(`{{ assign x = y | split }}{{ x }} from {{ y }}`),
  ).toMatchSnapshot();
});

test('filter w/ args', () => {
  expect(
    _parse(`{{ assign char = name | split "" }}{{ char }} from {{ name }}`),
  ).toMatchSnapshot();
});
