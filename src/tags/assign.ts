import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseExpression } from '../helpers/parse-expression';
import { compileExpression } from '../helpers/compile-expression';
import { SMP } from '../smp';

const ASSIGN = 'assign';
const ENDASSIGN = 'endassign';
const RE = /^assign\s+(.+?)$/;

/**
 * @example {{ assign my_var = my_obj }}
 */
export class AssignTag extends Tag {
  parse(match: RegExpExecArray, ast: AST): void | false {
    const [, statement] = match[1].match(RE) ?? [];

    if (statement) {
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;
      ast.start({
        name: ASSIGN,
        statement,
        startIndex,
        endIndex,
      });

      // Self closing
      ast.end({
        name: ENDASSIGN,
        startIndex: endIndex,
        endIndex,
      });

      return;
    }

    return false;
  }

  compile(
    template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false {
    if (tag.name === ASSIGN) {
      return this.compileAssign(template, tag as StartTag, context, ast, out, smp);
    }

    if (tag.name === ENDASSIGN) {
      return;
    }

    return false;
  }

  private compileAssign(
    _template: string,
    tag: StartTag,
    context: string,
    _ast: AST,
    out: Out,
    smp: SMP,
  ) {
    const { left, right } = this.parseStatement(tag.statement!);
    const object = compileExpression(
      right!.expression as string,
      context,
      right!.filters,
    );
    const lines: string[] = [];
    lines.push(`Object.assign(${context},{`);
    if (Array.isArray(left.expression)) {
      left.expression.forEach((key) => {
        lines.push(`${key}:${object}.${key},`);
      });
    } else {
      lines.push(`${left.expression}:${object},`);
    }
    lines.push(`});`);
    smp.addMapping(tag, out.pushLine(...lines));
  }

  private parseStatement(statement: string) {
    let [, left, right] = statement.match(/^(.+?)\s*=\s*(.+?)$/) ?? [];

    const names = left.split(/\s*,\s*/);

    return {
      left: {
        expression: names.length > 1 ? names : left,
        negative: false,
      },
      right: parseExpression(right),
      operator: '=',
    };
  }
}
