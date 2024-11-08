import { expect, test } from 'vitest';
import { SMP } from '../src/smp';
import { TemplateOptions } from '../src/types';

test('mapping', () => {
  const smp = new SMP({
  } as Required<TemplateOptions>);
  smp.addMapping({
    startIndex: 0,
    endIndex: 1,
  }, {
    startIndex: 2,
    endIndex: 3,
  });
  expect(smp.mappings).toMatchInlineSnapshot(`
    [
      {
        "source": {
          "endIndex": 1,
          "startIndex": 0,
        },
        "target": {
          "endIndex": 3,
          "startIndex": 2,
        },
      },
    ]
  `);
});