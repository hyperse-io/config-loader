import { resolve } from 'node:path';
import { loadConfig, searchConfig } from '../../src/config-loader/index.js';
import { type LoaderOptions } from '../../src/types.js';
import { getDirname } from '../test-utils.js';

const loaderOptions: LoaderOptions = {
  externals: ['vite'],
};

describe('ConfigLoader normal cjs', () => {
  const fixturesPath = getDirname(import.meta.url, 'fixtures/cjs');

  describe('loadConfig', () => {
    it('should load a valid CJS file with default export', async () => {
      const loadedCfg = await loadConfig<{
        cake: string;
      }>(resolve(fixturesPath, 'valid-default.config.cjs'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.cake).toStrictEqual('a lie');
    });

    it('should load a valid CJS file with nested exports', async () => {
      const loadedCfg = await loadConfig<{
        test: { cake: string };
      }>(resolve(fixturesPath, 'valid.config.cjs'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.test.cake).toStrictEqual('a lie');
    });

    it('should load a valid CJS file from nested directory', async () => {
      const loadedCfg = await loadConfig<{
        test: { cake: string };
      }>(resolve(fixturesPath, 'nested/valid.config.cjs'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.test.cake).toStrictEqual('a lie nest');
    });

    it('should load a valid CJS file with defineConfig', async () => {
      const loadedCfg = await loadConfig<{
        test: { cake: string };
      }>(resolve(fixturesPath, 'valid-external.config.cjs'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.test.cake).toStrictEqual('a lie');
    });

    it('should load a valid CJS file with defineConfig with loaderOptions', async () => {
      const loadedCfg = await loadConfig<{
        test: { cake: string };
      }>(resolve(fixturesPath, 'valid-external.config.cjs'), loaderOptions);
      expect(typeof loadedCfg?.config).toStrictEqual('object');
      expect(loadedCfg?.config.test.cake).toStrictEqual('a lie');
    });

    it('should return null for non-existent file', async () => {
      const loadedCfg = await loadConfig(
        resolve(fixturesPath, 'non-existent.config.cjs'),
        loaderOptions
      );
      expect(loadedCfg).toBeNull();
    });
  });

  describe('searchConfig', () => {
    it('should find and load config file in current directory', async () => {
      const searchResult = await searchConfig<{
        test: { cake: string };
      }>('valid', fixturesPath, loaderOptions);
      expect(searchResult).not.toBeNull();
      expect(searchResult?.config.test).toHaveProperty('cake');
    });

    it('should find and load config file in nested directory', async () => {
      const searchResult = await searchConfig<{
        test: { cake: string };
      }>('valid', resolve(fixturesPath, 'nested'), loaderOptions);
      expect(searchResult).not.toBeNull();
      expect(searchResult?.config.test.cake).toBe('a lie nest');
    });

    it('should return null when no config file is found', async () => {
      const searchResult = await searchConfig(
        'empty-dir',
        fixturesPath,
        loaderOptions
      );
      expect(searchResult).toBeNull();
    });
  });
});
