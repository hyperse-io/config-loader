import { cosmiconfig } from 'cosmiconfig';
import { type CosmiconfigResult } from 'cosmiconfig/dist/types.js';
import { existsSync } from 'fs';
import { type LoaderOptions } from '../types.js';
import { createLoaders } from './create-loaders.js';

type ConfigLoadResult<T> = Omit<CosmiconfigResult, 'config'> & {
  config: T;
};

/**
 * Search up the directory tree, checking each of these places in each directory, until it finds some acceptable configuration (or hits the home directory).
 * @param moduleName Your module name. This is used to create the default searchPlaces and packageProp.
 * @param searchFrom Default search from process.cwd()
 * @returns
 */
export const searchConfig = async <T = any>(
  moduleName: string,
  searchFrom: string = process.cwd(),
  options?: LoaderOptions
) => {
  const explorer = cosmiconfig(moduleName, {
    searchPlaces: [
      'package.json',
      `.${moduleName}rc`,
      `.${moduleName}rc.json`,
      `.${moduleName}rc.yaml`,
      `.${moduleName}rc.yml`,
      `.${moduleName}rc.js`,
      `.${moduleName}rc.mjs`,
      `.${moduleName}rc.cjs`,
      `${moduleName}.config.js`,
      `${moduleName}.config.mjs`,
      `${moduleName}.config.cjs`,
      // TS
      `.${moduleName}rc.ts`,
      `${moduleName}.config.ts`,
      `${moduleName}.config.mts`,
    ],
    loaders: createLoaders(options, searchFrom),
  });
  return explorer.search(searchFrom).then((result) => {
    return result as ConfigLoadResult<T> | null;
  });
};

export const loadConfig = async <T = any>(
  configFile: string,
  options?: LoaderOptions
) => {
  if (!existsSync(configFile)) {
    return null;
  }

  const explorer = cosmiconfig('', {
    loaders: createLoaders(options),
  });

  return explorer.load(configFile).then((result) => {
    return result as ConfigLoadResult<T> | null;
  });
};
