import { SMP } from '../smp';
import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseFormalArgs } from '../helpers/parse-formal-args';

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

  compile(
    template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false {
    if (tag.name === MACRO) {
      return this.compileMacro(
        template,
        tag as StartTag,
        context,
        ast,
        out,
        smp,
      );
    }

    if (tag.name === CALLER) {
      return this.compileCaller(
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
      return this.compileEndmacro(out);
    }

    return false;
  }

  private compileMacro(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    const affix = `${tag.node.level}_${tag.node.index}`;
    const { name, args } = this.parseStatement(tag.statement!);
    const lines: string[] = [];
    lines.push(`${context}.${name}=(${[...args, '_c'].join(',')})=>{`);
    if (args.length) {
      lines.push(`const ${context}_m_${affix}={`, `...${context},`);
      args.forEach((param) => {
        lines.push(`${param.replace(/(\w+)=.+/, '$1')},`);
      });
      lines.push(`};`);
    }
    smp.addMapping(tag, out.pushLine(...lines));
    this.parser.compileNodeContent(
      template,
      tag,
      `${context}_m_${affix}`,
      ast,
      out,
      smp,
    );
  }

  private compileCaller(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    smp.addMapping(tag, out.pushLine(`_c?.();`));
    this.parser.compileNodeContent(template, tag, context, ast, out, smp);
  }

  private compileEndmacro(out: Out) {
    out.pushLine('};');
  }

  private parseStatement(statement: string) {
    let [, name, args] = statement.match(/^(\w+?)(?:\s+(.+?))?$/) ?? [];

    return {
      name,
      args: parseFormalArgs(args),
    };
  }
}
