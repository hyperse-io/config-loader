import { isExternalModule } from '../src/helpers/is-external-module.js';

describe('is-external-module.ts', () => {
  it('Should correct check scoped modules', () => {
    const tests: Array<[string, boolean]> = [
      ['@wine/core', true],
      ['@dimjs/utils', true],
      ['~/my-module/utils', false],
      ['@mymouldes/', false],
    ];
    for (const [caseItem, result] of tests) {
      const isScopeModule = /@.+\/.+/.test(caseItem);
      expect(isScopeModule).toBe(result);
    }
  });

  it('Should correct resolve external modules', () => {
    const tests: Array<[Array<RegExp | string>, string, boolean]> = [
      [[], 'fs', true],
      [['vite'], '@wines/core', false],
      [['vite'], '@/core', false],
      [['@wine/core', '@dimjs/utils'], '@wine/core', true],
      [['@wine/core', '@dimjs/utils'], '@wine/utils', false],
      [['@wine/core', '@dimjs/utils'], '@wine/core/esm/class-names', true],
      [['@wine/core', '@dimjs/lang'], '@dimjs/lang/dist/is-array.js', true],
      [['rollup', '@rollup/plugin-alias'], './rollup', false],
      [['react', 'react-shadow-scope'], 'react', true],
      [['react'], 'react-shadow-scope', false],
      [['react', 'react-shadow-scope'], 'react-shadow-scope', true],
      [[/^@flatjs\/.*/], '@flatjs/plugin-a', true],
      [['@flatjs/*'], '@flatjs/forge-plugin-styling', false],
      [['@flatjs/*'], '@flatjs/plugin-styling', false],
      [['@flatjs/forge'], '@flatjs/forge', true],
      [['@flatjs/forge'], '@flatjs/forge-less-plugin-import-alias', false],
      [['flatjs-plugin-a'], 'flatjs-plugin-a', true],
      [['flatjs-plugin-*'], 'flatjs-plugin-a', false],
      [['flatjs-plugin-a'], 'flatjs-plugin-a-b', false],
      [['next'], 'next', true],
      [['next'], 'next/server.js', true],
      [['next'], 'next/header.js', true],
    ];
    for (const [allItems, moduleId, result] of tests) {
      expect(isExternalModule(allItems, moduleId)).toBe(result);
    }
  });
});
