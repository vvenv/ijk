import { ESCAPE } from './config';
import { TemplateOptions } from './types';

export class Out {
  private content = '';

  constructor(public options: Required<TemplateOptions>) {
    if (this.options.strictMode) {
      this.pushLine(`"use strict";`);
    }

    this.pushLine('let s = "";');
  }

  get value() {
    return this.content;
  }

  done() {
    this.pushLine('return s;');
  }

  pushLine(...lines: string[]) {
    for (const line of lines) {
      this.content += line;
    }
  }

  pushStr(s: string) {
    if (this.options.trimWhitespace) {
      s = s.replace(/\s+/gms, ' ');
      s = s.replace(/\s+(?=<[^<>]+>)/gms, ' ');
      s = s.replace(/(?=<\/[^<>]+>)\s+/gms, ' ');
    }

    if (s) {
      this.pushLine(`s+="${s.replace(/"/g, '\\"').replace(/\n/g, '\\n')}";`);
    }
  }

  pushVar(v: string) {
    this.pushLine(`s+=${ESCAPE}(${v});`);
  }
}
