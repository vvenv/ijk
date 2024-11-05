import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseExpression } from '../util/parse-expression';

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

  render(
    template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
  ): void | false {
    if (tag.name === ASSIGN) {
      return this.renderAssign(template, tag as StartTag, context, ast, out);
    }

    if (tag.name === ENDASSIGN) {
      return;
    }

    return false;
  }

  private renderAssign(
    _template: string,
    tag: StartTag,
    context: string,
    _ast: AST,
    out: Out,
  ) {
    const { left, right } = this.parseStatement(tag.statement!);
    const object = this.parser.getFilteredIdentifier(
      right!.expression as string,
      context,
      right!.filters,
    );
    out.pushLine(`Object.assign(${context}, {`);
    if (Array.isArray(left.expression)) {
      left.expression.forEach((key) => {
        out.pushLine(`${key}: ${object}.${key},`);
      });
    } else {
      out.pushLine(`${left.expression}: ${object},`);
    }
    out.pushLine(`});`);
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
