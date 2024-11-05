import { SMP } from '../smp';
import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseFormalParams } from '../util/parse-formal-params';

const MACRO = 'macro';
const ENDMACRO = 'endmacro';
const CALLER = 'caller';
const ENDCALLER = 'endcaller';
const RE = /^(?:macro\s+(.+))|(caller\(\))|((?:end|\/)macro)$/;

/**
 * @example {{ macro my_macro p1 p2 }}...{{ endmacro }}{{ my_macro "foo" 123 }}
 */
export class MacroTag extends Tag {
  parse(match: RegExpExecArray, ast: AST): void | false {
    const [, statement, caller, end] = match[1].match(RE) ?? [];

    if (end) {
      const tag = {
        name: ENDMACRO,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(MACRO, tag)) {
        ast.end(tag);
        return;
      }
    }

    if (caller) {
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;

      const tag = {
        name: CALLER,
        statement,
        startIndex,
        endIndex,
      };

      if (ast.assertFirstTag(MACRO, tag)) {
        ast.start(tag);

        // Self closing
        ast.end({
          name: ENDCALLER,
          startIndex: endIndex,
          endIndex,
        });

        return;
      }
    }

    if (statement) {
      ast.start({
        name: MACRO,
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
    if (tag.name === MACRO) {
      return this.renderMacro(
        template,
        tag as StartTag,
        context,
        ast,
        out,
        smp,
      );
    }

    if (tag.name === CALLER) {
      return this.renderCaller(
        template,
        tag as StartTag,
        context,
        ast,
        out,
        smp,
      );
    }

    if (tag.name === ENDCALLER) {
      return;
    }

    if (tag.name === ENDMACRO) {
      return this.renderEndmacro(out);
    }

    return false;
  }

  private renderMacro(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    const affix = `${tag.node.level}_${tag.node.index}`;
    const { name, params } = this.parseStatement(tag.statement!);
    out.pushLine(`${context}.${name} = (${[...params, '_c'].join(',')})=>{`);
    if (params.length) {
      out.pushLine(`const ${context}_m_${affix}={`, `...${context},`);
      params.forEach((param) => {
        out.pushLine(`${param.replace(/(\w+)=.+/, '$1')},`);
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
  }

  private renderCaller(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    out.pushLine(`_c?.();`);
    this.parser.renderNodeContent(template, tag, context, ast, out, smp);
  }

  private renderEndmacro(out: Out) {
    out.pushLine('};');
  }

  private parseStatement(statement: string) {
    let [, name, params] = statement.match(/^(\w+?)(?:\s+(.+?))?$/) ?? [];

    return {
      name,
      params: parseFormalParams(params),
    };
  }
}
