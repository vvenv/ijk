import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { SMP } from '../smp';
import { Tag } from '../tag';

const UNCLAIMED = 'unclaimed';
const ENDUNCLAIMED = 'endunclaimed';

/**
 * A fallback tag for unclaimed tags.
 */
export class UnclaimedTag extends Tag {
  static priority = -20;

  parse(match: RegExpExecArray, ast: AST): void {
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;

    ast.start({
      name: UNCLAIMED,
      statement: match[0],
      startIndex,
      endIndex,
    });

    // Self closing
    ast.end({
      name: ENDUNCLAIMED,
      startIndex: endIndex,
      endIndex,
    });
  }

  compile(
    _template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false {
    if (tag.name === UNCLAIMED) {
      return this.compileUnclaimed(
        (tag as StartTag).statement!,
        context,
        ast,
        out,
        smp,
      );
    }

    if (tag.name === ENDUNCLAIMED) {
      return;
    }

    return false;
  }

  private compileUnclaimed(
    template: string,
    _context: string,
    _ast: AST,
    out: Out,
    smp: SMP,
  ) {
    out.pushVar(`"${template.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\n\r]/g, '\\n')}"`);
    smp.addMapping(/* TODO */);
  }
}