import type { Plugin } from 'rollup';
import { isExternalModule } from '../helpers/isExternalModule.js';
import { isAbsolute, isImports, isRelative } from './utils.js';

/**
 * Implemented as a plugin instead of the external API
 */
export const externalizeNodeModules = (
  externalModules: Array<RegExp | string>,
  externalExclude?: (moduleId: RegExp | string) => boolean
): Plugin => {
  return {
    name: 'externalize-node-modules',
    resolveId(moduleId, importer) {
      if (
        !importer ||
        isRelative(moduleId) ||
        isAbsolute(moduleId) ||
        isImports(moduleId) ||
        moduleId.startsWith('\0')
      ) {
        return undefined;
      }

      let isExternal = false;
      if (externalExclude) {
        isExternal = !externalExclude(moduleId);
      } else {
        isExternal = isExternalModule(externalModules, moduleId);
      }
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
