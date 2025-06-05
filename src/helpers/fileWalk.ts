import { globby, type Options } from 'globby';

/**
 * Traversing the file system and returning pathnames that matched a defined set of a specified pattern according to the rules
 * @example
 * ```ts
 * // https://github.com/mrmlnc/fast-glob
 * const files = await fileWalk('**\/*.*', {
 *   cwd: fixtureCwd,
 *   ignore: ['**\/*.{jpg,png}'],
 * });
 * ```
 * @returns
 */
export const fileWalk = (
  pattern: string | readonly string[],
  options: Options = {}
): Promise<string[]> => {
  const ignorePattern = options.ignore || [];
  return globby(pattern, {
    absolute: true,
    dot: true,
    unique: true,
    ...options,
    ignore: [...ignorePattern, '**/__MACOSX/**', '**/*.DS_Store'],
  });
};
