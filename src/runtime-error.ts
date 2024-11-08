import { SMP } from './smp';
import { highlightSource } from './helpers/highlight-source';

interface RuntimeErrorOptions {
  source: string;
  error: Error;
  smp: SMP;
}

export class RuntimeError extends Error {
  constructor(
    message: string,
    private options: RuntimeErrorOptions,
  ) {
    super(message);
    this.name = 'RuntimeError';
    Error.captureStackTrace?.(this, this.constructor);
  }

  get details() {
    const tags =  this.options.smp.getTags(+(this.options.error.stack!.match(/<anonymous>:\d:(\d+)\)/)?.[1] ?? 0));

    return highlightSource(this.message, this.options.source, tags);
  }
}
