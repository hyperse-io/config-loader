import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Provider method to simulate __dirname veriable.
 * @param url import.meta.url
 * @param subDir sub directory
 * @returns __dirname
 */
export const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};
