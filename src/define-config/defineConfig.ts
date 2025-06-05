export type MaybePromise<T> = T | Promise<T>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type ConfigEnvBase = {
  //
};

export type UserConfigFn<UserConfig, ConfigEnv extends ConfigEnvBase> = (
  env: ConfigEnv
) => UserConfig | Promise<UserConfig>;

export type UserConfigExport<
  UserConfig,
  ConfigEnv extends ConfigEnvBase = ConfigEnvBase,
> = UserConfig | Promise<UserConfig> | UserConfigFn<UserConfig, ConfigEnv>;

export const defineConfig = <
  UserConfig,
  ConfigEnv extends ConfigEnvBase = ConfigEnvBase,
>(
  config: UserConfigExport<UserConfig, ConfigEnv>
) => config;
