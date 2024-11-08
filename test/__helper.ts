import { defaultOptions } from '../src/template';
import { Parser } from '../src/parser';
import { TemplateOptions } from '../src/types';
import { Tag } from '../src/tag';
import { ExpressionTag, UnclaimedTag } from '../src/tags';

export const parse = (
  template: string,
  options?: TemplateOptions,
  tags?: (typeof Tag)[],
) =>
  new Parser({ ...defaultOptions, ...options }, [
    ...(tags || []),
    ExpressionTag,
    UnclaimedTag,
  ]).parse(template).out.value;
