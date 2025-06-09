import { createConfigBundler } from '../helpers/createConfigBundler.js';
import { loadConfigFromFile } from '../helpers/loadConfigFromFile.js';
import { type ConfigLoader, type LoaderOptions } from '../types.js';

export function tsLoader(
  options: LoaderOptions = {
    externals: [],
    plugins: [],
  }
): ConfigLoader {
  return async (path: string) => {
    const configBundler = await createConfigBundler(options);
    const { config } = await loadConfigFromFile(path, configBundler);
    // `default` is used when exporting using export default, some modules
    // may still use `module.exports` or if in TS `export = `
    return config;
  };
}
