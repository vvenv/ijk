import { CONTEXT, FILTERS, ROOT, TAG_END, TAG_START } from './config';
import { AST, ASTNode, StartTag } from './ast';
import { Tag } from './tag';
import {
  IfTag,
  ForTag,
  BlockTag,
  AssignTag,
  MacroTag,
  CommentTag,
  VariableTag,
} from './tags';
import { isLiteral } from './util/is-literal';
import { parseActualParams } from './util/parse-actual-params';
import { FilterMeta } from './util/parse-filter';
import { TemplateOptions } from './types';
import { Out } from './out';
import { SMP } from './smp';

export class Parser {
  cursor = 0;
  private tags: Tag[] = [];
  private tagRe: RegExp;

  constructor(public options: Required<TemplateOptions>) {
    this.tagRe = new RegExp(
      `${options.tagStart ?? TAG_START}\\s*(.+?)\\s*${options.tagEnd ?? TAG_END}`,
      'gms',
    );

    this.registerTag(new IfTag(this));
    this.registerTag(new ForTag(this));
    this.registerTag(new BlockTag(this));
    this.registerTag(new MacroTag(this));
    this.registerTag(new AssignTag(this));
    this.registerTag(new CommentTag(this));
    // should be last
    this.registerTag(new VariableTag(this));
  }

  registerTag(tag: Tag) {
    this.tags.push(tag);
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
          this.renderNode(template, node, CONTEXT, ast, out, smp);
        });

        out.pushStr(template.slice(this.cursor));
      } else {
        out.pushStr(template);
      }
    }

    out.done();

    return { out, smp };
  }

  renderNode(
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
        if (tag.render(template, _tag, context, ast, out, smp) !== false) {
          break;
        }
      }
    }
  }

  renderNodeContent(
    template: string,
    tag: StartTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ) {
    if (tag.children.length) {
      tag.children.forEach((child) => {
        this.renderNode(template, child, context, ast, out, smp);
      });
    } else {
      const _tag = ast.getNextTag(tag);
      this.cursor = _tag.endIndex;
      out.pushStr(template.slice(tag.endIndex, _tag.startIndex));
    }
  }

  /**
   * Returns the expression with filters applied
   */
  getFilteredIdentifier(
    expression: string,
    context: string,
    filters: FilterMeta[] = [],
  ) {
    let identifier = isLiteral(expression)
      ? expression
      : `${context}.${expression}`;

    if (filters.length) {
      for (const { name, params } of filters) {
        const paramsStr: string = [
          identifier,
          ...parseActualParams(params, context),
        ].join(',');
        identifier = `${FILTERS}.${name}(${paramsStr})`;
      }
    }

    return identifier;
  }
}
