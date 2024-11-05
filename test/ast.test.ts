import { describe, expect, test } from 'vitest';
import { AST } from '../src/ast';
import { TemplateOptions } from '../src/types';

expect.addSnapshotSerializer({
  serialize: (_val) => 'AST',
  test: (val) => val instanceof AST,
});

test('empty', () => {
  const tree = new AST('', { debug: true } as Required<TemplateOptions>);

  expect(tree.valid).toBe(true);
  expect(tree.children).toMatchSnapshot();

  tree.start({
    name: 'root',
    startIndex: 0,
    endIndex: 0,
  });
  expect(tree.valid).toBe(false);
  expect(tree.children).toMatchSnapshot();

  tree.end({
    name: 'endroot',
    startIndex: 0,
    endIndex: 0,
  });
  expect(tree.valid).toBe(true);
  expect(tree.children).toMatchSnapshot();
});

describe('validation', () => {
  test('Unexpected endif tag', () => {
    const ast = new AST('', { debug: true } as Required<TemplateOptions>);

    expect(() =>
      ast.end({
        name: 'endif',
        startIndex: 0,
        endIndex: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`[ASTError: Unexpected endif tag]`);
    expect(ast.valid).toBe(true);
    expect(ast.children).toMatchSnapshot();
  });

  test('Unexpected else tag', () => {
    const ast = new AST('', { debug: true } as Required<TemplateOptions>);

    expect(() =>
      ast.between({
        name: 'else',
        startIndex: 0,
        endIndex: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(`[ASTError: Unexpected else tag]`);
    expect(ast.valid).toBe(true);
    expect(ast.children).toMatchSnapshot();
  });
});

test('production', () => {
  const ast = new AST('', {} as Required<TemplateOptions>);

  let i = 0;

  expect(ast.valid).toBe(true);
  expect(ast.children).toMatchSnapshot();

  ast.end({
    name: 'endif',
    startIndex: i++,
    endIndex: i++,
  });

  expect(ast.valid).toBe(true);
  expect(ast.children).toMatchSnapshot();

  ast.start({
    name: 'root',
    startIndex: 0,
    endIndex: 0,
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    statement: 'x',
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.end({
    name: 'endif',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    statement: 'x',
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.between({
    name: 'else',
    startIndex: i++,
    endIndex: i++,
    statement: 'y',
  });
  ast.start({
    name: 'if',
    startIndex: i,
    endIndex: i,
    statement: 'y',
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.between({
    name: 'else',
    startIndex: i++,
    endIndex: i++,
  });
  ast.start({
    name: 'if',
    startIndex: i,
    endIndex: i,
    statement: 'z',
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.start({
    name: 'if',
    startIndex: i++,
    endIndex: i++,
    statement: 'x',
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.end({
    name: 'endif',
    startIndex: i,
    endIndex: i,
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.end({
    name: 'endif',
    startIndex: i,
    endIndex: i,
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.end({
    name: 'endif',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.end({
    name: 'endif',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(false);
  expect(ast.children).toMatchSnapshot();

  ast.end({
    name: 'endroot',
    startIndex: i++,
    endIndex: i++,
  });
  expect(ast.valid).toBe(true);
  expect(ast.children).toMatchSnapshot();
});
