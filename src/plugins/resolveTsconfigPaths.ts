import { createPathsMatcher, type TsConfigResult } from 'get-tsconfig';
import type { Plugin } from 'rollup';

const name = 'hps-resolve-tsconfig-paths';

const isRelative = (filePath: string) => filePath[0] === '.';
const isAbsolute = (filePath: string) =>
  filePath[0] === '/' || /^[\s\S]:/.test(filePath);
const isImports = (filePath: string) => filePath[0] === '#';

const testFileExtensions = [
  '.js',
  '.jsx',
  '.cjs',
  '.mjs',
  '.ts',
  '.tsx',
  '.cts',
  '.mts',
];

const cleanSpecifierExtension = (specifier: string) => {
  return specifier.replace(/\.(js|jsx|cjs|mjs|ts|tsx|mts|cts)$/gi, '');
};

const makeAvailablePaths = (possiblePaths: string[]) => {
  const testAvailablePaths = new Set<string>(possiblePaths);
  for (const ext of testFileExtensions) {
    for (const possiblePath of possiblePaths) {
      const possiblePathWithoutExt = cleanSpecifierExtension(possiblePath);
      if (!testAvailablePaths.has(possiblePathWithoutExt + ext)) {
        testAvailablePaths.add(possiblePathWithoutExt + ext);
      }
    }
  }
  return testAvailablePaths;
};

export const resolveTsconfigPaths = (tsconfig: TsConfigResult): Plugin => {
  const pathsMatcher = createPathsMatcher(tsconfig);
  if (!pathsMatcher) {
    return {
      name,
    };
  }

  return {
    name,
    async resolveId(id, importer, options) {
      if (
        !importer ||
        isRelative(id) ||
        isAbsolute(id) ||
        isImports(id) ||
        id.startsWith('\0')
      ) {
        return null;
      }
      const possiblePaths = pathsMatcher(id);
      const allPossiblePaths = makeAvailablePaths(possiblePaths ?? []);
      for (const tryPath of allPossiblePaths) {
        const resolved = await this.resolve(tryPath, importer, {
          skipSelf: true,
          ...options,
        });
        if (resolved) {
          return resolved;
        }
      }
      return null;
    },
  };
};
