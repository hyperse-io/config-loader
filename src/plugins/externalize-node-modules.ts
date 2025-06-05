import type { Plugin } from 'rollup';
import { isExternalModule } from '../helpers/is-external-module.js';

/**
 * Implemented as a plugin instead of the external API
 */
export const externalizeNodeModules = (
  externalModules: Array<RegExp | string>
): Plugin => {
  return {
    name: 'externalize-node-modules',
    resolveId: (moduleId: string) => {
      const isExternal = isExternalModule(externalModules, moduleId);
      // If module is not external, return null to let other plugins to resolve it.
      if (!isExternal) {
        return null;
      }
      return {
        id: moduleId,
        external: !!isExternal,
      };
    },
  };
};
