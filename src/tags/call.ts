import { SMP } from '../smp';
import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { parseActualParams } from '../helpers/parse-actual-params';

const CALL = 'call';
const ENDCALL = 'endcall';
const RE = /^(?:call\s+(.+))|((?:end|\/)call)$/;

/**
 * @example {{ call my_macro "foo" "bar" }}...{{ endcall }}
 * @todo {{ call my_macro(foo | my_filter, bar) }}...{{ endcall }}
 */
export class CallTag extends Tag {
  parse(match: RegExpExecArray, ast: AST): void | false {
    const [, statement, end] = match[1].match(RE) ?? [];

    if (end) {
      const tag = {
        name: ENDCALL,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(CALL, tag)) {
        ast.end(tag);

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

  compile(
    template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false {
    if (tag.name === CALL) {
      return this.compileCall(
        template,
        tag as StartTag,
        context,
        ast,
        out,
        smp,
      );
    }

    if (tag.name === ENDCALL) {
      return this.compileEndcall(
        template,
        tag as EndTag,
        context,
        ast,
        out,
        smp,
      );
    }

    return false;
  }

  private compileCall(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    const { name, params } = this.parseStatement(tag.statement!, context);
    out.pushLine(`${context}.${name}(${params.join(',')},()=>{`);
    this.parser.compileNodeContent(template, tag, context, ast, out, smp);
  }

  private compileEndcall(
    _template: string,
    _tag: EndTag,
    _context: string,
    _ast: AST,
    out: Out,
    _smp: SMP,
  ) {
    out.pushLine('});');
  }

  private parseStatement(statement: string, context: string) {
    let [, name, params] = statement.match(/^(\w+?)(?:\s+(.+?))?$/) ?? [];

    return {
      name,
      params: parseActualParams(params, context),
    };
  }
}
