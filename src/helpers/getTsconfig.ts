import { getTsconfig as _getTsconfig, parseTsconfig } from 'get-tsconfig';
import { resolve } from 'node:path';

export const getTsconfig = (tscFile?: string) => {
  if (!tscFile) {
    return _getTsconfig();
  }

  const resolvedTscFile = resolve(tscFile);
  const config = parseTsconfig(resolvedTscFile);
  return {
    path: resolvedTscFile,
    config,
  };
};
