import { resolve } from 'node:path';
import { type ConfigBundler } from '../types.js';
import { bundleConfigFile } from './bundleConfigFile.js';
import { loadConfigFromBundledFile } from './loadConfigFromBundledFile.js';

export async function loadConfigFromFile(
  configFile: string,
  bundler?: ConfigBundler
): Promise<{
  resolvedPath: string;
  config: any;
}> {
  let resolvedPath: string | undefined;

  if (configFile) {
    // explicit config path is always resolved from cwd
    resolvedPath = resolve(configFile);
  }

  if (!resolvedPath) {
    throw new Error('no config file found.');
  }

  const bundled = await bundleConfigFile(resolvedPath, bundler);
  const result = loadConfigFromBundledFile(resolvedPath, bundled.code);

  return {
    config: result,
    resolvedPath: resolvedPath,
  };
}
