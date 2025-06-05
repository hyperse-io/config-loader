import type { Loader } from 'cosmiconfig';
import { createConfigBundler } from '../config-loader/create-config-bundler.js';
import { loadConfigFromFile } from '../helpers/load-config-from-file.js';
import { type LoaderOptions } from '../types.js';

export function tsLoader(
  options: LoaderOptions = {
    externals: [],
    plugins: [],
  }
): Loader {
  return async (path: string) => {
    const configBundler = await createConfigBundler(options);
    const { config } = await loadConfigFromFile(path, configBundler);
    // `default` is used when exporting using export default, some modules
    // may still use `module.exports` or if in TS `export = `
    return config;
  };
}
