import { type ConfigBundler } from '../types.js';

export async function bundleConfigFile(
  fileName: string,
  bundler?: ConfigBundler
): Promise<{ code: string }> {
  if (!bundler) {
    throw new Error(
      'You must implement your own esm config bundler, e.g. rollup'
    );
  }
  const { code } = await bundler.bundle(fileName);
  return {
    code,
  };
}
