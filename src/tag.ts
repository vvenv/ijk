import { SMP } from './smp';
import { AST, EndTag, StartTag } from './ast';
import { Out } from './out';
import { Parser } from './parser';

export abstract class Tag {
  static priority = 0;

  priority = 0;

  constructor(protected parser: Parser) {
    this.priority = (this.constructor as typeof Tag).priority;
  }

  abstract parse(match: RegExpExecArray, ast: AST): void | false;

  abstract compile(
    template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false;
}
