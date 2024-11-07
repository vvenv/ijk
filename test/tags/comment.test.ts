import { describe, expect, test } from 'vitest';
import { parse } from '../__helper';
import { CommentTag } from '../../src/tags';
import { TemplateOptions } from '../../src/types';

const _parse = (input: string, options?: TemplateOptions) =>
  parse(input, options, [CommentTag]);

describe('stripComments', () => {
  describe('on', () => {
    test('basic', () => {
      expect(_parse('{{# foo #}}')).toMatchSnapshot();
      expect(_parse('{{# foo #}}')).toMatchSnapshot();
    });

    test('multiline', () => {
      expect(_parse('{{# foo\nbar #}}')).toMatchSnapshot();
    });
  });

  describe('off', () => {
    test('basic', () => {
      expect(_parse('{{# foo #}}', { stripComments: false })).toMatchSnapshot();
      expect(_parse('{{# foo #}}', { stripComments: false })).toMatchSnapshot();
    });

    test('multiline', () => {
      expect(
        _parse('{{# foo\nbar #}}', { stripComments: false }),
      ).toMatchSnapshot();
    });
  });
});
