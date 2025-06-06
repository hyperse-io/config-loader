import { cosmiconfig } from 'cosmiconfig';
import { existsSync } from 'node:fs';
import { createLoaders } from '../helpers/createLoaders.js';
import { type ConfigLoadResult, type LoaderOptions } from '../types.js';

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
