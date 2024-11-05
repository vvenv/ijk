import { SMP } from '../smp';
import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';

const CALL = 'call';
const ENDCALL = 'endcall';
const RE = /^(?:call\s+(.+))|((?:end|\/)call)$/;

/**
 * @example
 * - {{ call my_macro "foo" "bar" }}
 */
export class CallTag extends Tag {
  parse(match: RegExpExecArray, ast: AST): void | false {
    const [, statement, end] = match[1].match(RE) ?? [];

    if (end) {
      if (ast.getFirstTag()?.name === CALL) {
        ast.end({
          name: ENDCALL,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });

        return;
      }
    }

    if (statement) {
      ast.start({
        name: CALL,
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
    if (tag.name === CALL) {
      return this.renderCall(template, tag as StartTag, context, ast, out, smp);
    }

    if (tag.name === ENDCALL) {
      return;
    }

    return false;
  }

  private renderCall(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    const affix = `${tag.node.level}_${tag.node.index}`;
    const { name, params } = this.parseStatement(tag.statement!);
    out.pushLine(`const _m_${affix} = (${params.join(',')})=>{`);
    if (params.length) {
      out.pushLine(`const ${context}_m_${affix}={`, `...${context},`);
      params.forEach((param) => {
        out.pushLine(`${param},`);
      });
      out.pushLine(`};`);
    }
    this.parser.renderNodeContent(
      template,
      tag,
      `${context}_m_${affix}`,
      ast,
      out,
      smp,
    );
    out.pushLine('return "";', '};');
    out.pushLine(`${context}.${name} = _m_${affix};`);
  }

  private parseStatement(statement: string) {
    let [, name, params] = statement.match(/^(\w+?)(?:\s+(.+?))?$/) ?? [];

    return {
      name,
      params: params ? params.split(/\s+/) : [],
    };
  }
}
