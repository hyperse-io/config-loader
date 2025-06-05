import { type Plugin } from 'rollup';

export interface ConfigBundler {
  bundle(fileName: string): Promise<{ code: string }>;
}

export type LoaderOptions = {
  projectCwd?: string;
  tsconfig?: string;
  plugins?: Plugin[];
  externals: Array<RegExp | string>;
};

/**
 * re-export from ts-essentials
 */
export { type DeepPartial } from 'ts-essentials';
