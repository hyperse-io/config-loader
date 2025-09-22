import { rollup } from 'rollup';
import { unpluginSwc } from '@hyperse/unplugin-swc';
import { externalizeNodeModules } from '../plugins/externalizeNodeModules.js';
import { resolveTsconfigPaths } from '../plugins/resolveTsconfigPaths.js';
import { type ConfigBundler, type LoaderOptions } from '../types.js';
import { getPackageDependencyKeys } from './getPackageDependencyKeys.js';
import { getTsconfig } from './getTsconfig.js';

export const createConfigBundler: (
  options: LoaderOptions
) => Promise<ConfigBundler> = async (options) => {
  const repoExternalModules = await getPackageDependencyKeys(
    options.projectCwd,
    options.externals
  );

  const tsconfig = getTsconfig(options.tsconfig);
  return {
    async bundle(fileName: string): Promise<{ code: string }> {
      const bundle = await rollup({
        input: fileName,
        treeshake: {
          annotations: true,
          moduleSideEffects: false,
          unknownGlobalSideEffects: false,
        },
        cache: false,
        plugins: [
          // Keep externalizeNodeModules plugin first, to externalize all external modules.
          externalizeNodeModules(repoExternalModules, options.externalExclude),
          // keep correct order, make tsPaths resolver plugin after externalizeNodeModules plugin
          ...(tsconfig ? [resolveTsconfigPaths(tsconfig)] : []),
          // swc plugin
          unpluginSwc.rollup({
            tsconfigFile: tsconfig?.path,
          }),
          ...(options.plugins || []),
        ],
      });
      const { output } = await bundle.generate({
        format: 'esm',
        indent: true,
        extend: true,
        strict: false,
      });
      const allCodes: string[] = [];
      for (const chunkOrAsset of output) {
        if (chunkOrAsset.type !== 'asset') {
          allCodes.push(chunkOrAsset.code);
        }
      }
      const bundledCode = allCodes.join('\n');
      return {
        code: bundledCode,
      };
    },
  };
};
