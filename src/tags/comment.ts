import { AST, EndTag, StartTag } from '../ast';
import { Out } from '../out';
import { Tag } from '../tag';
import { SMP } from '../smp';

const COMMENT = 'comment';
const ENDCOMMENT = 'endcomment';
const RE = /^\s*(?:!\s*(.+?)|#\s*(.+?)\s*#|(comment)|(endcomment))\s*$/ms;

/**
 * @example {{! This is a comment }}
 * @example {{# This is a comment #}}
 * @example {{comment}} This is a comment {{endcomment}}
 */
export class CommentTag extends Tag {
  parse(match: RegExpExecArray, ast: AST): void | false {
    const [, __, statement = __, start, end] = match[1].match(RE) ?? [];

    if (end) {
      const tag = {
        name: ENDCOMMENT,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(COMMENT, tag)) {
        ast.end(tag);
        return;
      }
    }

    if (start) {
      ast.start({
        name: COMMENT,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });

      return;
    }

    if (statement) {
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;

      ast.start({
        name: COMMENT,
        statement,
        startIndex,
        endIndex,
      });

      // Self closing
      ast.end({
        name: ENDCOMMENT,
        startIndex: endIndex,
        endIndex,
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
    if (tag.name === COMMENT) {
      if (!out.options.stripComments) {
        const content = (tag as StartTag).statement;
        if (content) {
          out.pushStr(`<!--${content}-->`);
        } else {
          out.pushStr('<!--');
          this.parser.compileNodeContent(
            template,
            tag as StartTag,
            context,
            ast,
            out,
            smp,
          );
        }
      }
      return;
    }

    if (tag.name === ENDCOMMENT) {
      if (!out.options.stripComments) {
        if (!tag.prev?.statement) {
          out.pushStr('-->');
        }
      }
      return;
    }

    return false;
  }
}
