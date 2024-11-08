import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { SMP } from '../smp';
import { Tag } from '../tag';
import { isLiteral } from '../helpers/is-literal';
import { parseExpression } from '../helpers/parse-expression';
import { compileExpression } from '../helpers/compile-expression';

const EXPRESSION = 'expression';
const ENDEXPRESSION = 'endexpression';

/**
 * @example {{ my_var | my_filter }}
 */
export class ExpressionTag extends Tag {
  static priority = -10;

  parse(match: RegExpExecArray, ast: AST): void | false {
    const statement = match[1];
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;

    if (this.assertExpression(statement)) {
      ast.start({
        name: EXPRESSION,
        statement,
        startIndex,
        endIndex,
      });

      // Self closing
      ast.end({
        name: ENDEXPRESSION,
        startIndex: endIndex,
        endIndex,
      });

      return;
    }

    return false;
  }

  compile(
    _template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false {
    if (tag.name === EXPRESSION) {
      return this.compileExpression(
        (tag as StartTag).statement!,
        context,
        ast,
        out,
        smp,
      );
    }

    if (tag.name === ENDEXPRESSION) {
      return;
    }

    return false;
  }

  private assertExpression(statement: string) {
    // TODO: more strict assertion
    return (
      !/(window\.)?(alert|confirm|prompt)/.test(statement) &&
      !/^[<>]/.test(statement)
    );
  }

  private compileExpression(
    template: string,
    context: string,
    _ast: AST,
    out: Out,
    smp: SMP,
  ) {
    if (isLiteral(template)) {
      out.pushVar(template);
      smp.addMapping(/* TODO */);
    } else {
      const { expression, filters } = parseExpression(template);

      out.pushVar(compileExpression(expression, context, filters));
    }
  }
}
