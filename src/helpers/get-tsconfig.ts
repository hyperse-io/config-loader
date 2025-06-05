import { getTsconfig as _getTsconfig, parseTsconfig } from 'get-tsconfig';
import path from 'path';

export const getTsconfig = (tscFile?: string) => {
  if (!tscFile) {
    return _getTsconfig();
  }

  const resolvedTscFile = path.resolve(tscFile);
  const config = parseTsconfig(resolvedTscFile);
  return {
    path: resolvedTscFile,
    config,
  };
};
