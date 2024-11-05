import { Template } from './template';
import { TemplateOptions } from './types';

export * from './template';

export const template = (
  template: string,
  data: object,
  options?: TemplateOptions,
) => new Template(options).compile(template).render(data);
