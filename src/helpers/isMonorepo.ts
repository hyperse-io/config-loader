import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileWalk } from './fileWalk.js';
/**
 * A monorepo (mono repository) is a single repository that stores all of your code and assets for every project.
 * @param cwd normally it always process.cwd()
 */
export const isMonorepo = async (cwd: string = process.cwd()) => {
  const monoPackageCwd = join(cwd, 'packages');
  if (existsSync(monoPackageCwd)) {
    const packageJson = await fileWalk(join(monoPackageCwd, '*/package.json'), {
      cwd,
    });
    return packageJson.length > 0;
  }
  return false;
};
