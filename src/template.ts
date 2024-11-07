import { CONTEXT, ESCAPE, FILTERS, TAG_END, TAG_START, UTILS } from './config';
import * as filters from './filters';
import * as utils from './utils';
import { escape } from './escape';
import { Parser } from './parser';
import { Safe } from './safe';
import { Tag } from './tag';
import {
  AssignTag,
  BlockTag,
  CallTag,
  CommentTag,
  ForTag,
  IfTag,
  MacroTag,
  VariableTag,
} from './tags';
import { TemplateOptions } from './types';

export const defaultOptions: Required<TemplateOptions> = {
  debug: false,
  autoEscape: true,
  strictMode: true,
  collapseWhitespace: true,
  stripComments: true,
  tagStart: TAG_START,
  tagEnd: TAG_END,
};

export class Template {
  private options: Required<TemplateOptions>;
  private parser: Parser;
  private filters: Record<string, Function> = {};
  private globals: Record<string, any> = {};

  constructor(options?: TemplateOptions) {
    this.options = { ...defaultOptions, ...options };

    this.parser = new Parser(this.options, [
      AssignTag,
      BlockTag,
      CallTag,
      CommentTag,
      ForTag,
      IfTag,
      MacroTag,
      VariableTag,
    ]);
  }

  addGlobal(name: string, value: any) {
    this.globals[name] = value;
  }

  registerFilter(name: string, func: Function) {
    this.filters[name] = func;
    return this;
  }

  registerTag(tag: typeof Tag) {
    this.parser.registerTag(tag);
  }

  compile(template: string): {
    __func: Function;
    render: (context: object) => string;
  } {
    try {
      const { out, smp } = this.parser.parse(template);
      const func = new Function(CONTEXT, FILTERS, ESCAPE, UTILS, out.value);
      (func as any).smp = smp;
      return {
        __func: this.options.debug ? func : defaultFunc,
        render: (context: object): string => {
          try {
            return func.call(
              null,
              { ...this.globals, ...context },
              { ...filters, ...this.filters },
              (v: unknown) => {
                if (v instanceof Safe) {
                  return `${v}`;
                }
                let str = `${v}`;
                if (this.options.autoEscape) {
                  str = str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                }
                return escape(str);
              },
              utils,
            );
          } catch (error) {
            if (this.options.debug) {
              console.trace(func);
              throw error;
            }
          }

          return '';
        },
      };
    } catch (error) {
      if (this.options.debug) {
        throw error;
      }
      return {
        __func: defaultFunc,
        render: fallbackRender,
      };
    }
  }
}

function defaultFunc() {
  throw new Error('`__func` is only available in debug mode');
}

function fallbackRender() {
  return '';
}
