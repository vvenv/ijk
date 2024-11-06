import { SMP } from '../smp';
import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseExpression } from '../helpers/parse-expression';

const FOR = 'for';
const ELSE = 'else';
const ENDFOR = 'endfor';
const RE = /^(?:for\s+(.+))|(else)|((?:end|\/)for)$/;

/**
 * @example {{ for item in items }}{{ item }}{{ endfor }}
 */
export class ForTag extends Tag {
  parse(match: RegExpExecArray, ast: AST): void | false {
    const [, statement, _else, end] = match[1].match(RE) ?? [];

    if (end) {
      const tag = {
        name: ENDFOR,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(FOR, tag)) {
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

      if (ast.assertFirstTag(FOR, tag, false)) {
        ast.between(tag);
        return;
      }
    }

    if (statement) {
      ast.start({
        name: FOR,
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
    if (tag.name === FOR) {
      return this.renderFor(template, tag as StartTag, context, ast, out, smp);
    }

    if (tag.name === ELSE) {
      if (tag.prev?.name === FOR) {
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

    if (tag.name === ENDFOR) {
      return this.renderEndfor(out);
    }

    return false;
  }

  private renderFor(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    const affix = `${tag.node.level}_${tag.node.index}`;
    const { left, operator, right } = this.parseStatement(tag.statement!);
    const items = this.parser.getFilteredIdentifier(
      right!.expression as string,
      context,
      right!.filters,
    );
    if (operator === 'of') {
      out.pushLine(`const l_${affix}=${items}.length;`);
    } else {
      out.pushLine(`const k_${affix}=Object.keys(${items});`);
      out.pushLine(`const l_${affix}=k_${affix}.length;`);
    }
    if ((tag.next as StartTag).name === ELSE) {
      out.pushLine(`if (l_${affix}) {`);
    }
    out.pushLine(
      `for(let i_${affix}=0;i_${affix}<l_${affix};i_${affix}++){`,
      `const ${context}_i_${affix}={`,
      `...${context},`,
    );
    if (operator === 'of') {
      if (Array.isArray(left.expression)) {
        left.expression.forEach((key, i) => {
          out.pushLine(`${key}:${items}[i_${affix}][${i}],`);
        });
      } else {
        out.pushLine(`${left.expression}:${items}[i_${affix}],`);
      }
    } else {
      if (Array.isArray(left.expression)) {
        out.pushLine(`${left.expression[0]}:k_${affix}[i_${affix}],`);
        out.pushLine(`${left.expression[1]}:${items}[k_${affix}[i_${affix}]],`);
      } else {
        out.pushLine(`${left.expression}:${items}[k_${affix}[i_${affix}]],`);
      }
    }
    out.pushLine(
      `loop:{`,
      `index:i_${affix},`,
      `first:i_${affix}===0,`,
      `last:i_${affix}===l_${affix},`,
      `length:l_${affix}`,
      `}`,
      `};`,
    );
    this.parser.renderNodeContent(
      template,
      tag,
      `${context}_i_${affix}`,
      ast,
      out,
      smp,
    );
  }

  private renderElse(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    out.pushLine('}');
    out.pushLine('}else{');
    this.parser.renderNodeContent(template, tag, context, ast, out, smp);
  }

  private renderEndfor(out: Out) {
    out.pushLine('}');
  }

  private parseStatement(statement: string) {
    let [, left, operator, right] =
      statement.match(/^(.+?)\s+(in|of)\s+(.+?)$/) ?? [];

    const names = left.split(/\s*,\s*/);

    return {
      left: {
        expression: names.length > 1 ? names : left,
        negative: false,
      },
      right: parseExpression(right),
      operator,
    };
  }
}
