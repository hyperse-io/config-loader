import { join } from 'node:path';
import {
  loadConfig,
  searchConfig,
} from '../../src/config-loader/config-loader.js';
import { type LoaderOptions } from '../../src/types.js';
import { getDirname } from '../test-utils.js';

const loaderOptions: LoaderOptions = {
  externals: ['vite'],
};
const fixturesPath = getDirname(import.meta.url, 'fixtures/esm-ts');

describe('ESM-TS config loader tests', () => {
  describe('loadConfig', () => {
    it('should load a valid .ts config file', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(join(fixturesPath, 'valid.config.ts'), loaderOptions);
      expect(typeof loadedCfg?.config).toBe('object');
      expect(loadedCfg?.config.cake).toBe('a lie');
    });

    it('should load a config with `defineConfig` and type parameters', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(join(fixturesPath, 'defineConfig.config.ts'), loaderOptions);
      expect(typeof loadedCfg?.config).toBe('object');
      expect(loadedCfg?.config.cake).toBe('a lie');
    });

    it('should find and load config file in nested directory', async () => {
      const searchResult = await loadConfig<{
        cake: string;
      }>(join(fixturesPath, 'nested/valid.config.ts'), loaderOptions);
      expect(searchResult).not.toBeNull();
      expect(searchResult?.config.cake).toBe('a lie nest');
    });

    it('should handle non-existent file gracefully', async () => {
      const loadedCfg = await loadConfig(
        join(fixturesPath, 'non-existent.config.ts'),
        loaderOptions
      );
      expect(loadedCfg).toBeNull();
    });
  });

  describe('searchConfig', () => {
    it('should search and load a valid .ts config file', async () => {
      const loadedCfg = await searchConfig<{
        cake: string;
      }>('valid', fixturesPath, loaderOptions);
      expect(typeof loadedCfg?.config).toBe('object');
      expect(loadedCfg?.config.cake).toBe('a lie');
    });

    it('should load a valid file from nested directory', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(join(fixturesPath, 'nested/valid.config.ts'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie nest');
    });

    it('should search and load a `defineConfig` .ts config file', async () => {
      const loadedCfg = await searchConfig<{
        cake: string;
      }>('defineConfig', fixturesPath, loaderOptions);
      expect(typeof loadedCfg?.config).toBe('object');
      expect(loadedCfg?.config.cake).toBe('a lie');
    });

    it('should return null for non-existent config', async () => {
      const loadedCfg = await searchConfig<{
        cake: string;
      }>('non-existent', fixturesPath, loaderOptions);
      expect(loadedCfg).toBeNull();
    });

    it('should search and load a config with named export', async () => {
      const loadedCfg = await searchConfig<{
        test: {
          cake: string;
        };
      }>('named-exports', fixturesPath, loaderOptions);
      expect(loadedCfg?.config.test.cake).toBe('a lie');
    });
  });
});
