import { describe, expect, test } from 'vitest';
import { parse } from './__helper';

describe('stripComments', () => {
  describe('on', () => {
    test('basic', () => {
      expect(parse('{{# foo #}}')).toMatchSnapshot();
      expect(parse('{{# foo #}}')).toMatchSnapshot();
    });

    test('multiline', () => {
      expect(parse('{{# foo\nbar #}}')).toMatchSnapshot();
    });
  });

  describe('off', () => {
    test('basic', () => {
      expect(parse('{{# foo #}}', { stripComments: false })).toMatchSnapshot();
      expect(parse('{{# foo #}}', { stripComments: false })).toMatchSnapshot();
    });

    test('multiline', () => {
      expect(
        parse('{{# foo\nbar #}}', { stripComments: false }),
      ).toMatchSnapshot();
    });
  });
});
