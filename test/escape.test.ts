import { expect, test } from 'vitest';
import { escape } from '../src/escape';

test('escape &, ", and \'', () => {
  expect(escape('&"\'')).toMatchInlineSnapshot(`"&amp;&#34;&#39;"`);
});
