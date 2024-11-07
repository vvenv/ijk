import { CONTEXT, ROOT, TAG_END, TAG_START } from './config';
import { AST, ASTNode, StartTag } from './ast';
import { Tag } from './tag';
import { TemplateOptions } from './types';
import { Out } from './out';
import { SMP } from './smp';

export class Parser {
  cursor = 0;
  private tags: Tag[] = [];
  private tagRe: RegExp;

  constructor(
    public options: Required<TemplateOptions>,
    tags: (typeof Tag)[] = [],
  ) {
    this.tagRe = new RegExp(
      `${options.tagStart ?? TAG_START}\\s*(.+?)\\s*${options.tagEnd ?? TAG_END}`,
      'gms',
    );
    this.tags = tags
      .sort((a, b) => b.priority - a.priority)
      .map((tag) => new (tag as any)(this));
  }

  registerTag(tag: typeof Tag) {
    this.tags.push(new (tag as any)(this));
    this.tags.sort((a, b) => b.priority - a.priority);
  }

  parse(template: string) {
    const ast = new AST(template, this.options);
    const out = new Out(this.options);
    const smp = new SMP(template, this.options);

    ast.start({
      name: ROOT,
      startIndex: 0,
      endIndex: 0,
      children: [],
    });

    let match;
    while ((match = this.tagRe.exec(template))) {
      let handled = false;
      for (const tag of this.tags) {
        if (tag.parse(match, ast) !== false) {
          handled = true;
          break;
        }
      }

      if (!handled) {
        if (this.options.debug) {
          console.trace(match);
          throw new Error('Invalid template');
        }
      }
    }

    ast.end({
      name: `end${ROOT}`,
      startIndex: template.length,
      endIndex: template.length,
    });

    if (!ast.valid) {
      if (this.options.debug) {
        console.trace(ast);
        throw new Error('Invalid template');
      }
    } else {
      this.cursor = 0;
      const { children } = ast;
      if (children.length) {
        children.forEach((node) => {
          this.compileNode(template, node, CONTEXT, ast, out, smp);
        });

        out.pushStr(template.slice(this.cursor));
      } else {
        out.pushStr(template);
      }
    }

    out.done();

    return { out, smp };
  }

  compileNode(
    template: string,
    { tags }: ASTNode,
    context = CONTEXT,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    for (const _tag of tags) {
      out.pushStr(template.slice(this.cursor, _tag.startIndex));
      this.cursor = _tag.endIndex;

      for (const tag of this.tags) {
        if (tag.compile(template, _tag, context, ast, out, smp) !== false) {
          break;
        }
      }
    }
  }

  compileNodeContent(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    if (tag.children.length) {
      tag.children.forEach((child) => {
        this.compileNode(template, child, context, ast, out, smp);
      });
    } else {
      const _tag = ast.getNextTag(tag);
      this.cursor = _tag.endIndex;
      out.pushStr(template.slice(tag.endIndex, _tag.startIndex));
    }
  }
}
