import { SMP } from '../smp';
import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseExpression } from '../helpers/parse-expression';
import { compileExpression } from '../helpers/compile-expression';

const FOR = 'for';
const ELSE = 'else';
const ENDFOR = 'endfor';
const RE = /^(?:for\s+(.+))|(else)|((?:end|\/)for)$/;

/**
 * @example {{ for item in items }}{{ item }}{{ endfor }}
 * @example {{ for key value in items }}{{ key }}:{{ value }}{{ endfor }}
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

  compile(
    template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false {
    if (tag.name === FOR) {
      return this.compileFor(template, tag as StartTag, context, ast, out, smp);
    }

    if (tag.name === ELSE) {
      if (tag.prev?.name === FOR) {
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

    if (tag.name === ENDFOR) {
      return this.compileEndfor(out);
    }

    return false;
  }

  private compileFor(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    const affix = `${tag.node.level}_${tag.node.index}`;
    const { left, right } = this.parseStatement(tag.statement!);
    const items = compileExpression(
      right!.expression as string,
      context,
      right!.filters,
    );
    out.pushLine(`const o_${affix}=${items};`);
    out.pushLine(`const a_${affix}=Array.isArray(o_${affix});`);
    out.pushLine(`const k_${affix}=Object.keys(o_${affix});`);
    out.pushLine(`const l_${affix}=k_${affix}.length;`);
    if ((tag.next as StartTag).name === ELSE) {
      out.pushLine(`if(l_${affix}){`);
    }
    out.pushLine(
      `for(let i_${affix}=0;i_${affix}<l_${affix};i_${affix}++){`,
      `const ${context}_i_${affix}={`,
      `...${context},`,
    );
    if (Array.isArray(left.expression)) {
      left.expression.forEach((name, index) => {
        out.pushLine(
          `${name}:a_${affix}?o_${affix}[k_${affix}[i_${affix}]][${index}]:${index}===0?k_${affix}[i_${affix}]:o_${affix}[k_${affix}[i_${affix}]],`,
        );
      });
    } else {
      out.pushLine(`${left.expression}:o_${affix}[k_${affix}[i_${affix}]],`);
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
    this.parser.compileNodeContent(
      template,
      tag,
      `${context}_i_${affix}`,
      ast,
      out,
      smp,
    );
  }

  private compileElse(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    out.pushLine('}');
    out.pushLine('}else{');
    this.parser.compileNodeContent(template, tag, context, ast, out, smp);
  }

  private compileEndfor(out: Out) {
    out.pushLine('}');
  }

  private parseStatement(statement: string) {
    let [, left, right] = statement.match(/^(.+?)\s+in\s+(.+?)$/) ?? [];

    const names = left.split(/\s+/);

    return {
      left: {
        expression: names.length > 1 ? names : left,
        negative: false,
      },
      right: parseExpression(right),
    };
  }
}
