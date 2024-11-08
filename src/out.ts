import { ESCAPE } from './config';
import { Location } from './smp';
import { TemplateOptions } from './types';

export class Out {
  private content = '';
  private varOffset = `s+=${ESCAPE}(`.length;

  constructor(public options: Required<TemplateOptions>) {
    if (this.options.strictMode) {
      this.pushLine(`"use strict";`);
    }

    this.pushLine('let s="";');
  }

  get value() {
    return this.content;
  }

  done() {
    this.pushLine('return s;');
  }

  pushLine(...lines: string[]): Location {
    const startIndex = this.content.length;
    for (const line of lines) {
      this.content += line;
    }
    return {
      startIndex,
      endIndex: this.content.length,
    };
  }

  pushStr(s: string): Location | void {
    if (this.options.collapseWhitespace) {
      s = s.replace(/\s+/gms, ' ');
    }

    if (s) {
      const startIndex = this.content.length + 4;
      s = s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/[\n\r]/g, '\\n');
      this.pushLine(`s+="${s}";`);
      return {
        startIndex,
        endIndex: this.content.length - 2,
      };
    }
  }

  pushVar(v: string): Location  {
    const startIndex = this.content.length + this.varOffset;
    this.pushLine(`s+=${ESCAPE}(${v});`);
    return {
      startIndex,
      endIndex: startIndex + v.length,
    };
  }
}
