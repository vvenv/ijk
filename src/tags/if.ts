import { SMP } from '../smp';
import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseExpression } from '../util/parse-expression';

const IF = 'if';
const ELIF = 'elif';
const ELSE = 'else';
const ENDIF = 'endif';
const RE = /^(?:(el)?if\s+(.+))|(else)|((?:end|\/)if)$/;

/**
 * @example {{ if my_var | my_filter }}yes{{ else }}no{{ endif }}
 */
export class IfTag extends Tag {
  parse(match: RegExpExecArray, ast: AST): void | false {
    const [, _elif, statement, _else, end] = match[1].match(RE) ?? [];

    if (end) {
      const tag = {
        name: ENDIF,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(IF, tag)) {
        ast.end(tag);
        return;
      }
    }

    if (_else) {
      const tag = {
        name: ELSE,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(IF, tag, false)) {
        ast.between(tag);
        return;
      }
    }

    if (_elif) {
      const tag = {
        name: ELIF,
        statement,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(IF, tag)) {
        ast.between(tag);
        return;
      }
    }

    if (statement) {
      ast.start({
        name: IF,
        statement,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
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
    smp: SMP,
  ): void | false {
    if (tag.name === IF) {
      return this.renderIf(template, tag as StartTag, context, ast, out, smp);
    }

    if (tag.name === ELIF) {
      return this.renderIf(
        template,
        tag as StartTag,
        context,
        ast,
        out,
        smp,
        true,
      );
    }

    if (tag.name === ELSE) {
      if (tag.prev?.name === IF) {
        return this.renderElse(
          template,
          tag as StartTag,
          context,
          ast,
          out,
          smp,
        );
      }
    }

    if (tag.name === ENDIF) {
      return this.renderEndif(out);
    }

    return false;
  }

  private renderIf(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
    isElif = false,
  ): void | false {
    let { left, leftNot, operator, right, rightNot } = this.parseStatement(
      tag.statement!,
    );
    const identifierLeft = this.parser.getFilteredIdentifier(
      left.expression as string,
      context,
      left.filters,
    );
    const condition = [`${leftNot ? '!' : ''}${identifierLeft}`];
    if (operator) {
      condition.push(operator);
      const identifierRight = this.parser.getFilteredIdentifier(
        right!.expression as string,
        context,
        right!.filters,
      );
      condition.push(`${rightNot ? '!' : ''}${identifierRight}`);
    }
    out.pushLine(`${isElif ? '} else if' : 'if'} (${condition.join(' ')}) {`);
    this.parser.renderNodeContent(template, tag, context, ast, out, smp);
  }

  private renderElse(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    out.pushLine('} else {');
    this.parser.renderNodeContent(template, tag, context, ast, out, smp);
  }

  private renderEndif(out: Out) {
    out.pushLine('}');
  }

  private parseStatement(statement: string) {
    const [, leftNot, left, op1, operator = op1, rightNot, right] =
      statement.match(
        /^(?:(!|not)\s*)?(.+?)(?:(?:(?:\s+(in|includes|eq|ne|and|or)\s+)|(?:\s*((?:!=|==)=?|>|<|>=|<=)\s*))(?:(!|not)\s*)?(.+?))?$/,
      ) ?? [];

    if (operator) {
      return {
        left: parseExpression(left),
        leftNot: !!leftNot,
        right: parseExpression(right),
        rightNot: !!rightNot,
        operator: this.normalizeOperator(operator),
      };
    }

    return {
      left: parseExpression(left),
      leftNot: !!leftNot,
    };
  }

  private normalizeOperator(operator: string) {
    switch (operator) {
      case '!=':
      case 'ne':
        return '!==';
      case '==':
      case 'eq':
        return '===';
      case 'and':
        return '&&';
      case 'or':
        return '||';
      default:
        return operator;
    }
  }
}
