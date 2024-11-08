import { AST } from './ast';
import { highlightSource } from './helpers/highlight-source';
import { Location } from './smp';

interface ASTErrorOptions {
  ast: AST;
  tags: Location[];
}

export class ASTError extends SyntaxError {
  constructor(
    message: string,
    private options: ASTErrorOptions,
  ) {
    super(message);
    this.name = 'ASTError';
    SyntaxError.captureStackTrace?.(this, this.constructor);
  }

  get details() {
    return highlightSource(this.message, this.options.ast.template, this.options.tags);
  }
}
