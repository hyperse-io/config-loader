import type { CosmiconfigResult, Loader } from 'cosmiconfig';
import { type Plugin } from 'rollup';

export interface ConfigBundler {
  bundle(fileName: string): Promise<{ code: string }>;
}

export type ConfigLoadResult<T> = Omit<CosmiconfigResult, 'config'> & {
  config: T;
};

export type LoaderOptions = {
  /**
   * The current working directory of the project.
   * @default process.cwd()
   */
  projectCwd?: string;
  /**
   * The path to the tsconfig.json file.
   * @default undefined
   */
  tsconfig?: string;
  /**
   * The rollup plugins to use for the config loader.
   * @default []
   */
  plugins?: Plugin[];
  /**
   * The rollup externals to use for the config loader.
   * @default []
   */
  externals: Array<RegExp | string>;
  /**
   * The function to create the loaders.
   * @default undefined
   */
  createLoaders?: (
    options?: LoaderOptions,
    searchFrom?: string
  ) => Record<string, Loader>;
};

export type _DeepPartial<T> = T extends (...args: any[]) => any
  ? T
  : T extends Array<infer U>
    ? Array<_DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<_DeepPartial<U>>
      : T extends object
        ? DeepPartial<T>
        : T | undefined;

export type DeepPartial<T> = { [P in keyof T]?: _DeepPartial<T[P]> };
