import { defaultOptions } from '../../src/template';
import { Parser } from '../../src/parser';
import { TemplateOptions } from '../../src/types';

export const parse = (template: string, options?: TemplateOptions) =>
  new Parser({ ...defaultOptions, ...options }).parse(template);
