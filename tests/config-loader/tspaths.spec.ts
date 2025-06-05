import { resolve } from 'node:path';
import {
  loadConfig,
  searchConfig,
} from '../../src/config-loader/config-loader.js';
import { type LoaderOptions } from '../../src/types.js';
import { getDirname } from '../test-utils.js';

const fixturesPath = getDirname(import.meta.url, 'fixtures/ts-paths');

const loaderOptions: LoaderOptions = {
  externals: ['vite'],
  tsconfig: resolve(fixturesPath, 'tsconfig.json'),
};

describe('ConfigLoader ts paths', () => {
  describe('cosmiconfig load single config file for .ts', () => {
    it('should search a valid TS file with named export for .ts', async () => {
      const loadedCfg = await searchConfig<{
        cake: string;
      }>('valid-default', fixturesPath, loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });

    it('should load a valid TS file with default export', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(resolve(fixturesPath, 'valid-default.config.ts'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });
  });
});
