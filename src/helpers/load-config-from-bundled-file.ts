import { unlink } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export async function loadConfigFromBundledFile(
  fileName: string,
  bundledCode: string
) {
  // for esm, before we can register loaders without requiring users to run node
  // with --experimental-loader themselves, we have to do a hack here:
  // write it to disk, load it with native Node ESM, then delete the file.
  const fileBase = `${fileName}.timestamp-${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
  const fileNameTmp = `${fileBase}.mjs`;
  const fileUrl = `${pathToFileURL(fileBase)}.mjs`;
  await writeFile(fileNameTmp, bundledCode);
  try {
    const result = await import(fileUrl);
    return result.default || result;
  } finally {
    unlink(fileNameTmp, () => {
      //
    });
  }
}
