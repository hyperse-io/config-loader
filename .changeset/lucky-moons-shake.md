---
"@hyperse/config-loader": patch
---

Upgrade dependencies to their latest major versions and modernize the toolchain: `cosmiconfig` 9 → 10, `@hyperse/unplugin-swc` 1 → 2, `@swc/core` 1.15 → 1.16, `get-tsconfig` 4.13 → 4.14, plus dev tooling (`typescript` 7, `vitest` 5, `vite` 8, `eslint` 10, `tsup` 9, `execa` 10, `lint-staged` 17) and Yarn 4.10.2 → 4.18.1.

No public API changes: the consumed `cosmiconfig` (`cosmiconfig`, `Loader`, `CosmiconfigResult`) and `get-tsconfig` (`getTsconfig`, `parseTsconfig`, `createPathsMatcher`) signatures are unchanged, so no source adaptation was required. The `env.*` config loading and tsconfig `paths` resolution behavior are preserved.

Config-only adjustments: drop the deprecated `baseUrl` from `tsconfig.json` (removed in TypeScript 7), and set `YARN_NPM_AUTH_TOKEN` in the release workflow so Yarn Berry can authenticate against npm when publishing.
