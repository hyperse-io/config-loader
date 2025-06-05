import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { packageDirectorySync } from 'pkg-dir';
import { fileWalk } from './fileWalk.js';
import { isMonorepo } from './isMonorepo.js';

function arrayUnique<T>(arr: T[]): T[] {
  function onlyUnique(value: T, index: number, self: T[]) {
    return self.indexOf(value) === index;
  }
  return arr.filter(onlyUnique);
}

function readJsonFromFile<T>(fileFrom: string) {
  const content = readFileSync(fileFrom, { encoding: 'utf-8' });
  return JSON.parse(content) as T;
}

export const getPackageDependencyKeys = async (
  cwd = process.cwd(),
  externals: Array<RegExp | string> = []
) => {
  const projectCwd =
    packageDirectorySync({
      cwd,
    }) || process.cwd();

  const allPackageJson: string[] = projectCwd
    ? [join(projectCwd, 'package.json')]
    : [];

  const repoCwd = join(projectCwd, '../..');
  const isMono = await isMonorepo(repoCwd);
  if (isMono) {
    const monoCwd = join(repoCwd, './packages/*/package.json');
    const monoPackageJson = await fileWalk(monoCwd);
    allPackageJson.push(...monoPackageJson);
  }
  const externalModules: Array<RegExp | string> = [...externals];

  for (const packageJson of allPackageJson) {
    const pkgJson = readJsonFromFile<{
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    }>(packageJson);
    externalModules.push(
      ...Object.keys({
        ...pkgJson.dependencies,
        ...pkgJson.devDependencies,
      })
    );
  }
  return arrayUnique(externalModules);
};
