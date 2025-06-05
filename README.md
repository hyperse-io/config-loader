# @hyperse/config-loader

A config loader that searches for and loads configuration files for your program, with support for `type:module`, `esm`, and `cjs` module formats

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/config-loader/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/config-loader/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/config-loader">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Fconfig-loader?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/config-loader/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/config-loader?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/config-loader/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/config-loader?style=flat-quare&labelColor=000000" />
  </a>
</p>

The config loader is a powerful utility that searches for and loads configuration files for your JavaScript/TypeScript applications. It automatically handles multiple file formats and module systems while providing type safety.

Built on top of cosmiconfig, it implements smart defaults aligned with JavaScript ecosystem conventions, while remaining highly configurable. You can customize search paths, file formats, and loading behavior to match your specific needs.

## Features

- 🔍 Automatic config file resolution with support for multiple formats (JSON, YAML, JS, TS)
- 🎯 Flexible configuration search across multiple file locations
- 🚀 ESM and CommonJS module support
- 🔧 TypeScript configuration with full type inference
- ⚡️ Built on top of cosmiconfig for reliable config loading
- 🧪 Well-tested and production-ready
- 🔄 Automatic resolution of TypeScript path aliases from tsconfig.json
- 🔗 Smart handling of external modules and dependencies
- 📦 Automatically marks package.json dependencies and devDependencies as external
- 🏗️ Built-in support for monorepo setups and workspace packages

## Installation

```bash
npm install --save @hyperse/config-loader
```

## API Reference

### `searchConfig<T>(moduleName: string, searchFrom?: string, options?: LoaderOptions)`

Searches up the directory tree for configuration files, checking multiple locations in each directory until it finds a valid configuration or reaches the home directory.

**Parameters:**

- `moduleName` (string): Your module name. Used to create default search places and package properties
- `searchFrom` (string, optional): Directory to start searching from. Defaults to `process.cwd()`
- `options` (LoaderOptions, optional): Configuration options for the loader

**Returns:** Promise<ConfigLoadResult<T> | null>

**Example:**

```typescript
import { searchConfig } from '@hyperse/config-loader';

// Search for a config file named 'myapp'
const result = await searchConfig<{
  port: number;
  database: {
    url: string;
  };
}>('myapp');

if (result) {
  console.log(result.config.port); // Access the loaded config
}
```

### `loadConfig<T>(configFile: string, options?: LoaderOptions)`

Loads a configuration file from a specific path.

**Parameters:**

- `configFile` (string): Path to the configuration file
- `options` (LoaderOptions, optional): Configuration options for the loader

**Returns:** Promise<ConfigLoadResult<T> | null>

**Example:**

```typescript
import { loadConfig } from '@hyperse/config-loader';

// Load a specific config file
const result = await loadConfig<{
  port: number;
  database: {
    url: string;
  };
}>('./config/myapp.config.ts');

if (result) {
  console.log(result.config.port);
}
```

### `mergeOptions<T>(target: T, source: DeepPartial<T>, mergeUndefined?: boolean)`

Performs a deep merge of two configuration objects. Unlike `Object.assign()`, the target object is not mutated.

**Parameters:**

- `target` (T): The target object to merge into
- `source` (DeepPartial<T>): The source object to merge from
- `mergeUndefined` (boolean, optional): Whether to merge undefined values. Defaults to false

**Returns:** T (new merged object)

**Example:**

```typescript
import { mergeOptions } from '@hyperse/config-loader';

const defaultConfig = {
  server: {
    port: 3000,
    host: 'localhost',
  },
  database: {
    url: 'postgres://localhost:5432/mydb',
    pool: {
      min: 0,
      max: 10,
    },
  },
};

const userConfig = {
  server: {
    port: 4000,
  },
  database: {
    pool: {
      max: 20,
    },
  },
};

const mergedConfig = mergeOptions(defaultConfig, userConfig);
// Result:
// {
//   server: {
//     port: 4000,
//     host: 'localhost'
//   },
//   database: {
//     url: 'postgres://localhost:5432/mydb',
//     pool: {
//       min: 0,
//       max: 20
//     }
//   }
// }
```

### `defineConfig<T, ConfigEnv extends ConfigEnvBase = ConfigEnvBase>`

A type helper for defining configuration objects with proper typing and environment support.

**Example:**

```typescript
import { defineConfig } from '@hyperse/config-loader';

interface MyConfig {
  port: number;
  database: {
    url: string;
  };
}

interface MyConfigEnv {
  mode: 'development' | 'production';
}

export default defineConfig<MyConfig, MyConfigEnv>((env) => {
  return {
    port: env.mode === 'production' ? 80 : 3000,
    database: {
      url:
        env.mode === 'production'
          ? 'postgres://prod:5432/mydb'
          : 'postgres://localhost:5432/mydb',
    },
  };
});
```

### LoaderOptions

Configuration options for the loader:

```typescript
interface LoaderOptions {
  projectCwd?: string; // Project root directory
  tsconfig?: string; // Path to tsconfig.json
  plugins?: Plugin[]; // Additional plugins
  externals: Array<RegExp | string>; // External dependencies to exclude
}
```

### Supported File Formats

The config loader supports the following file formats:

- `.js` (ESM and CommonJS)
- `.mjs` (ESM)
- `.cjs` (CommonJS)
- `.ts` (TypeScript)
- `.mts` (TypeScript ESM)
- `.json`
- `.yaml`/`.yml`

The loader will search for files in the following order:

1. `package.json` (in the `[moduleName]` field)
2. `.[moduleName]rc`
3. `.[moduleName]rc.json`
4. `.[moduleName]rc.yaml`
5. `.[moduleName]rc.yml`
6. `.[moduleName]rc.js`
7. `.[moduleName]rc.mjs`
8. `.[moduleName]rc.cjs`
9. `.[moduleName]rc.ts`
10. `[moduleName].config.js`
11. `[moduleName].config.mjs`
12. `[moduleName].config.cjs`
13. `[moduleName].config.ts`
14. `[moduleName].config.mts`
