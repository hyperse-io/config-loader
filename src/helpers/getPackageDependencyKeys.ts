import { getPackages } from '@manypkg/get-packages';

function arrayUnique<T>(arr: T[]): T[] {
  function onlyUnique(value: T, index: number, self: T[]) {
    return self.indexOf(value) === index;
  }
  return arr.filter(onlyUnique);
}

export const getPackageDependencyKeys = async (
  cwd = process.cwd(),
  externals: Array<RegExp | string> = [],
  externalExclude?: (moduleId: RegExp | string) => boolean
) => {
  const externalModules: Array<RegExp | string> = [...externals];

  const { packages } = await getPackages(cwd);

  for (const pkg of packages) {
    const { dependencies, devDependencies } = pkg.packageJson;
    externalModules.push(
      ...Object.keys({
        ...dependencies,
        ...devDependencies,
      })
    );
  }
  return arrayUnique(externalModules).filter((moduleId) => {
    if (externalExclude) {
      return !externalExclude(moduleId);
    }
    return true;
  });
};
