import { builtinModules, isBuiltin } from 'node:module';

const ensureSlash = (str: string) => {
  return str.replace(/\/$/, '') + '/';
};
/**
 * Indicate which modules should be treated as external
 * @param externalModules the external modules we have known from package.json
 * @param packageName which module we need to verify.
 */
export const isExternalModule = (
  externalModules: Array<RegExp | string>,
  moduleId: string
): boolean => {
  if (builtinModules.includes(moduleId) || isBuiltin(moduleId)) {
    return true;
  }
  // `@scope/module`
  const isScopeModule = /@.+\/.+/.test(moduleId);

  // Note while we use `babel-plugin-import` it will tranform `@dimjs/utils` to precise down to the module level
  // e.g. import { classNames } from '@dimjs/utils'; will be use transform to.
  // import _classNames from '@dimjs/utils/esm/class-names'; we should flag `@dimjs/utils/esm/class-names` to external.
  if (isScopeModule) {
    return (
      // `@scope/module` exact match
      externalModules.includes(moduleId) ||
      // `@scope/.*`, moduleId: `@dimjs/utils/esm/class-names`
      !!externalModules.find((externalModule) => {
        if (typeof externalModule === 'string') {
          return moduleId.startsWith(ensureSlash(externalModule));
        }
        return externalModule.test(moduleId);
      })
    );
  }
  // `react`, `react-shadow-scope`
  // Treat it as external modules when the `moduleId` is defined as dependencies, or it is node builtin modules.
  const isExternal =
    externalModules.includes(moduleId) ||
    !!externalModules.find((externalModule) => {
      if (typeof externalModule === 'string') {
        return (
          externalModule === moduleId ||
          moduleId.startsWith(ensureSlash(externalModule))
        );
      }
      return externalModule.test(moduleId);
    });

  return !!isExternal;
};
