import { expect, test } from 'vitest';
import { compileExpression } from '../../src/helpers/compile-expression';

test('basic', () => {
  expect(
    compileExpression('x', 'c', [{ name: 'y', args: '1' }, { name: 'z' }]),
  ).toMatchInlineSnapshot(`"f.z(f.y(c.x,1))"`);
  expect(
    compileExpression('x', 'c', [{ name: 'y', args: '"1"' }, { name: 'z' }]),
  ).toMatchInlineSnapshot(`"f.z(f.y(c.x,"1"))"`);
});
