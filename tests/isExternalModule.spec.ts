import { isExternalModule } from '../src/helpers/isExternalModule.js';

describe('isExternalModule', () => {
  it('Should correct check scoped modules', () => {
    const tests: Array<[string, boolean]> = [
      ['@hps/core', true],
      ['@hps/utils', true],
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
      [['vite'], '@hps/core', false],
      [['vite'], '@/core', false],
      [['@hps/core', '@hyperse/utils'], '@hps/core', true],
      [['@hps/core', '@hyperse/utils'], '@hps/utils', false],
      [['@hps/core', '@hyperse/utils'], '@hps/core/esm/class-names', true],
      [['@hps/core', '@hyperse/lang'], '@hyperse/lang/dist/is-array.js', true],
      [['rollup', '@rollup/plugin-alias'], './rollup', false],
      [['react', 'react-shadow-scope'], 'react', true],
      [['react'], 'react-shadow-scope', false],
      [['react', 'react-shadow-scope'], 'react-shadow-scope', true],
      [[/^@hps\/.*/], '@hps/plugin-a', true],
      [['@hps/*'], '@hps/forge-plugin-styling', false],
      [['@hps/*'], '@hps/plugin-styling', false],
      [['@hps/forge'], '@hps/forge', true],
      [['@hps/forge'], '@hps/forge-less-plugin-import-alias', false],
      [['hps-plugin-a'], 'hps-plugin-a', true],
      [['hps-plugin-*'], 'hps-plugin-a', false],
      [['hps-plugin-a'], 'hps-plugin-a-b', false],
      [['next'], 'next', true],
      [['next'], 'next/server.js', true],
      [['next'], 'next/header.js', true],
    ];
    for (const [allItems, moduleId, result] of tests) {
      expect(isExternalModule(allItems, moduleId)).toBe(result);
    }
  });
});
