import { ASTError } from './ast-error';
import { TemplateOptions } from './types';

export interface EndTag {
  name: string;
  startIndex: number;
  endIndex: number;
  block: ASTNode;
  prev: StartTag;
  next: null;
}

export interface StartTag {
  name: string;
  statement?: string;
  startIndex: number;
  endIndex: number;
  node: ASTNode;
  prev: StartTag | null;
  next: StartTag | EndTag | null;
  children: ASTNode[];
}

export interface ASTNode {
  tags: [...StartTag[], EndTag];
  parent: ASTNode | null;
  prev: ASTNode | null;
  next: ASTNode | null;
  level: number;
  index: number;
  skip?: boolean;
}

export class AST implements ASTNode {
  private cursor: ASTNode;

  tags: [StartTag, EndTag];
  parent: null;
  prev: null;
  next: null;
  level: number;
  index: number;

  constructor(
    public template = '',
    public options: Required<TemplateOptions>,
  ) {
    this.tags = [] as unknown as [StartTag, EndTag];
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.level = 0;
    this.index = 0;

    this.cursor = this;
  }

  get valid() {
    return this.cursor === this && this.tags.length % 2 === 0;
  }

  get children() {
    return this.tags[0]?.children ?? [];
  }

  start(tag: Partial<StartTag>): StartTag {
    const { tags } = this.cursor;

    const startTag = {
      ...tag,
      prev: null,
      next: null,
      children: [],
    } as StartTag;

    // []
    if (tags.length === 0) {
      startTag.node = this.cursor;
      tags.push(startTag);
      return startTag;
    }

    // [...StartTag]
    const lastTag = tags.at(-1) as StartTag;
    const lastBlock = lastTag.children.at(-1) ?? null;

    const node: ASTNode = {
      tags: [startTag] as unknown as [StartTag, EndTag],
      parent: this.cursor,
      prev: lastBlock ?? null,
      next: null,
      level: this.cursor.level + 1,
      index: lastTag.children.length,
    };

    if (lastBlock) {
      lastBlock.next = node;
    }
    startTag.node = node;
    lastTag.children.push(node);
    this.cursor = node as ASTNode;

    return startTag;
  }

  between(tag: Partial<StartTag>) {
    const { tags } = this.cursor;

    if (!tags.length) {
      if (this.options.debug) {
        throw new ASTError(`Unexpected ${tag.name} tag`, {
          ast: this,
          tags: [tag],
        });
      }

      return;
    }

    const lastTag = tags.at(-1) as StartTag;
    const _tag = {
      ...tag,
      node: lastTag.node,
      prev: lastTag,
      next: null,
      children: [],
    } as StartTag;

    lastTag.next = _tag;
    tags.push(_tag);
  }

  end(tag: Partial<EndTag>) {
    const { tags } = this.cursor;

    if (!tags.length) {
      if (this.options.debug) {
        throw new ASTError(`Unexpected ${tag.name} tag`, {
          ast: this,
          tags: [tag],
        });
      }

      return;
    }

    const [startTag] = tags as [StartTag, EndTag];

    const expected = `end${startTag.name}`;
    if (expected !== tag.name) {
      if (this.options.debug) {
        console.trace(tag, tags);
        throw new ASTError(
          `Unexpected "${tag.name}" tag, expected "${expected}"`,
          {
            ast: this,
            tags: [tag],
          },
        );
      }

      return;
    }

    const lastTag = tags.at(-1) as StartTag;
    const _tag = {
      ...tag,
      block: startTag.node,
      prev: lastTag,
      next: null,
    } as EndTag;

    lastTag.next = _tag;
    tags.push(_tag);

    // It's a close block, so we need to move the cursor to the parent
    this.cursor = this.cursor.parent ?? this;
  }

  private throw(message: string, ...tags: Partial<StartTag | EndTag>[]) {
    if (this.options.debug) {
      throw new ASTError(message, {
        ast: this,
        tags,
      });
    }
    return false;
  }

  getFirstTag() {
    return this.cursor.tags.at(0);
  }

  assertFirstTag(
    name: string,
    tag: Partial<StartTag | EndTag>,
    required = true,
  ) {
    const firstTag = this.cursor.tags.at(0)!;
    if (firstTag.name !== name) {
      if (required) {
        this.throw(
          `"${tag.name}" must follow "${name}", not "${firstTag.name}".`,
          firstTag,
          tag,
        );
      }
      return false;
    }
    return true;
  }

  getLastTag() {
    return this.cursor.tags.at(-1);
  }

  getNextTag(tag: StartTag) {
    return tag.children[0]?.tags[0] ?? tag.next;
  }

  getPrevTag(tag: StartTag) {
    return tag.prev ?? tag.node.prev?.tags.at(-1);
  }
}
