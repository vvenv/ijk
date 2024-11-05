import { TemplateOptions } from './types';

export class SMP {
  constructor(
    public template = '',
    public options: Required<TemplateOptions>,
  ) {}

  addMapping() {
    // TODO
  }
}
