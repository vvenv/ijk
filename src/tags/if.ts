import { SMP } from '../smp';
import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseExpression } from '../helpers/parse-expression';
import { UTILS } from '../config';
import { compileExpression } from '../helpers/compile-expression';

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

  compile(
    template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false {
    if (tag.name === IF) {
      return this.compileIf(template, tag as StartTag, context, ast, out, smp);
    }

    if (tag.name === ELIF) {
      return this.compileIf(
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
      if (tag.prev?.name === IF || tag.prev?.name === ELIF) {
        return this.compileElse(
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
      return this.compileEndif(out);
    }

    return false;
  }

  private compileIf(
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
    let identifierLeft = compileExpression(
      left.expression as string,
      context,
      left.filters,
    );
    if (leftNot) {
      identifierLeft = `!${identifierLeft}`;
    }
    let identifierRight;
    if (operator) {
      identifierRight = compileExpression(
        right!.expression as string,
        context,
        right!.filters,
      );
      if (rightNot) {
        identifierRight = `!${identifierRight}`;
      }
    }
    smp.addMapping(tag, out.pushLine(
      `${isElif ? '}else if' : 'if'}(${this.normalizeExpression(identifierLeft, operator, identifierRight)}){`,
    ));
    this.parser.compileNodeContent(template, tag, context, ast, out, smp);
  }

  private compileElse(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    out.pushLine('}else{');
    this.parser.compileNodeContent(template, tag, context, ast, out, smp);
  }

  private compileEndif(out: Out) {
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

  private normalizeExpression(left: string, operator?: string, right?: string) {
    if (!operator) {
      return left;
    }

    if (operator === 'in') {
      return `${UTILS}.isIn(${left},${right})`;
    }

    if (operator === 'includes') {
      return `${UTILS}.isInclude(${left},${right})`;
    }

    return `${left}${operator}${right}`;
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
