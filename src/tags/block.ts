import { AST, EndTag, StartTag } from '../ast';
import { Tag } from '../tag';
import { ROOT } from '../config';
import { Out } from '../out';
import { SMP } from '../smp';

const BLOCK = 'block';
const ENDBLOCK = 'endblock';
const SUPER = 'super';
const ENDSUPER = 'endsuper';
const RE = /^(?:block\s+(.+))|(super\(\))|((?:end|\/)block)$/;

export class BlockTag extends Tag {
  private tagsMap: Record<string, StartTag[]> = {};

  parse(match: RegExpExecArray, ast: AST): void | false {
    const [, statement, _super, end] = match[1].match(RE) ?? [];

    if (end) {
      const tag = {
        name: ENDBLOCK,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(BLOCK, tag)) {
        ast.end(tag);
        return;
      }
    }

    if (_super) {
      const startIndex = match.index;
      const endIndex = match.index + match[0].length;

      const tag = {
        name: SUPER,
        statement,
        startIndex,
        endIndex,
      };

      if (ast.assertFirstTag(BLOCK, tag)) {
        ast.start(tag);

        // Self closing
        ast.end({
          name: ENDSUPER,
          startIndex: endIndex,
          endIndex,
        });

        return;
      }
    }

    if (statement) {
      const tag = {
        name: BLOCK,
        statement,
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      };

      if (ast.assertFirstTag(ROOT, tag)) {
        const startTag = ast.start(tag);

        // Save start tags to map
        if (!this.tagsMap[statement]) {
          this.tagsMap[statement] = [];
        }

        this.tagsMap[statement].push(startTag);

        return;
      }
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
    if (tag.name === BLOCK) {
      return this.renderBlock(
        template,
        tag as StartTag,
        context,
        ast,
        out,
        smp,
      );
    }

    if (tag.name === SUPER) {
      return this.renderSuper(out);
    }

    if (tag.name === ENDSUPER) {
      return;
    }

    if (tag.name === ENDBLOCK) {
      return;
    }

    return false;
  }

  private renderBlock(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    const tags = this.getTags(tag.statement!);
    if (tags.indexOf(tag) === 0) {
      const affix = `${tag.node.level}_${tag.node.index}`;
      let curry = '';
      for (let i = 0; i < tags.length; i++) {
        let _tag = tags[i] as StartTag;
        this.parser.cursor = _tag.endIndex;
        out.pushLine(`const _b_${affix}_${_tag.startIndex}=(_s)=>{`);
        this.parser.renderNodeContent(template, _tag, context, ast, out, smp);
        out.pushStr(
          template.slice(this.parser.cursor, (_tag.next as EndTag).startIndex),
        );
        this.parser.cursor = (_tag.next as EndTag).endIndex;
        out.pushLine('};');
        curry = `()=>_b_${affix}_${_tag.startIndex}(${curry})`;
      }

      out.pushLine(`(${curry})();`);
    } else {
      this.parser.cursor = tag.next!.endIndex;
    }
  }

  private renderSuper(out: Out) {
    out.pushLine(`_s?.();`);
  }

  private getTags(statement: string) {
    return this.tagsMap[statement] ?? [];
  }
}
