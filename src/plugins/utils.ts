export const isRelative = (filePath: string) => filePath[0] === '.';

export const isAbsolute = (filePath: string) =>
  filePath[0] === '/' || /^[\s\S]:/.test(filePath);

export const isImports = (filePath: string) => filePath[0] === '#';
