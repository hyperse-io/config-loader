import type { Loader } from 'cosmiconfig';
import { tsLoader } from '../loaders/tsLoader.js';
import { type LoaderOptions } from '../types.js';

export const createLoaders = (
  options?: LoaderOptions,
  searchFrom?: string
): Record<string, Loader> => {
  const overrideLoaders = options?.createLoaders?.(options, searchFrom);

  return {
    '.ts': createTsLoader(options, searchFrom),
    '.mts': createTsLoader(options, searchFrom),
    ...overrideLoaders,
  };
};

function createTsLoader(options?: LoaderOptions, searchFrom?: string): Loader {
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
