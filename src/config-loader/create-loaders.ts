import type { Loader } from 'cosmiconfig';
import { tsLoader } from '../loaders/ts-loader.js';
import { type LoaderOptions } from '../types.js';

export const createLoaders = (
  options?: LoaderOptions,
  searchFrom?: string
): Record<string, Loader> => {
  return {
    '.ts': myLoader(options, searchFrom),
    '.mts': myLoader(options, searchFrom),
  };
};

function myLoader(options?: LoaderOptions, searchFrom?: string): Loader {
  return async (path: string, content: string) => {
    const { projectCwd, ...restLoaderOptions } = options || {};
    return tsLoader({
      plugins: [],
      externals: [],
      ...restLoaderOptions,
      projectCwd: projectCwd || searchFrom,
    })(path, content);
  };
}
