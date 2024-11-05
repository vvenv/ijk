import { SMP } from './smp';
import { AST, EndTag, StartTag } from './ast';
import { Out } from './out';
import { Parser } from './parser';

export abstract class Tag {
  constructor(protected parser: Parser) {}

  abstract parse(match: RegExpExecArray, ast: AST): void | false;

  abstract render(
    template: string,
    tag: StartTag | EndTag,
    context: string,
    ast: AST,
    out: Out,
    smp: SMP,
  ): void | false;
}
