import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { SMP } from '../smp';
import { Tag } from '../tag';
import { isLiteral } from '../helpers/is-literal';
import { parseExpression } from '../helpers/parse-expression';

const VARIABLE = 'variable';
const ENDVARIABLE = 'endvariable';

/**
 * @example {{ my_var | my_filter }}
 */
export class VariableTag extends Tag {
  parse(match: RegExpExecArray, ast: AST): void {
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;

    ast.start({
      name: VARIABLE,
      statement: match[1],
      startIndex,
      endIndex,
    });

    // Self closing
    ast.end({
      name: ENDVARIABLE,
      startIndex: endIndex,
      endIndex,
    });
  }

  render(
    _template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false {
    if (tag.name === VARIABLE) {
      return this.renderVariable(
        (tag as StartTag).statement!,
        context,
        ast,
        out,
        smp,
      );
    }

    if (tag.name === ENDVARIABLE) {
      return;
    }

    return false;
  }

  private renderVariable(
    template: string,
    context: string,
    _ast: AST,
    out: Out,
    smp: SMP,
  ) {
    if (isLiteral(template)) {
      out.pushVar(template);
      smp.addMapping(/* TODO */);
    } else {
      const { expression, filters } = parseExpression(template);

      out.pushVar(
        this.parser.getFilteredIdentifier(expression, context, filters),
      );
    }
  }
}
