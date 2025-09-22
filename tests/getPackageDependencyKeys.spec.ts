import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPackages } from '@manypkg/get-packages';
import { getPackageDependencyKeys } from '../src/helpers/getPackageDependencyKeys.js';

// Mock @manypkg/get-packages
vi.mock('@manypkg/get-packages', () => ({
  getPackages: vi.fn(),
}));

describe('getPackageDependencyKeys', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return unique dependency keys from all packages', async () => {
    // Mock package data
    const mockPackages = {
      packages: [
        {
          packageJson: {
            dependencies: {
              react: '^18.0.0',
              lodash: '^4.17.0',
            },
            devDependencies: {
              typescript: '^5.0.0',
              vitest: '^1.0.0',
            },
          },
        },
        {
          packageJson: {
            dependencies: {
              react: '^18.0.0', // Duplicate dependency
              axios: '^1.0.0',
            },
            devDependencies: {
              eslint: '^8.0.0',
            },
          },
        },
      ],
    };

    (getPackages as any).mockResolvedValue(mockPackages);

    const result = await getPackageDependencyKeys();

    expect(getPackages).toHaveBeenCalledWith(process.cwd());
    expect(result).toEqual([
      'react',
      'lodash',
      'typescript',
      'vitest',
      'axios',
      'eslint',
    ]);
  });

  it('should include external modules passed as arguments', async () => {
    const mockPackages = {
      packages: [
        {
          packageJson: {
            dependencies: {
              react: '^18.0.0',
            },
          },
        },
      ],
    };

    (getPackages as any).mockResolvedValue(mockPackages);

    const externals = ['@types/node', /^@babel\/.*/];
    const result = await getPackageDependencyKeys(process.cwd(), externals);

    expect(result).toEqual(['@types/node', /^@babel\/.*/, 'react']);
  });

  it('should handle empty package dependencies', async () => {
    const mockPackages = {
      packages: [
        {
          packageJson: {
            dependencies: {},
            devDependencies: {},
          },
        },
      ],
    };

    (getPackages as any).mockResolvedValue(mockPackages);

    const result = await getPackageDependencyKeys();

    expect(result).toEqual([]);
  });

  it('should handle custom working directory', async () => {
    const customCwd = '/custom/path';
    const mockPackages = {
      packages: [
        {
          packageJson: {
            dependencies: {
              react: '^18.0.0',
            },
          },
        },
      ],
    };

    (getPackages as any).mockResolvedValue(mockPackages);

    await getPackageDependencyKeys(customCwd);

    expect(getPackages).toHaveBeenCalledWith(customCwd);
  });

  it('should exclude external modules passed as arguments', async () => {
    const mockPackages = {
      packages: [
        {
          packageJson: {
            dependencies: {
              react: '^18.0.0',
              'react-dom': '^18.0.0',
            },
            devDependencies: {
              typescript: '^4.0.0',
            },
          },
        },
      ],
    };

    (getPackages as any).mockResolvedValue(mockPackages);

    const externals = ['react', 'react-dom', 'typescript'];
    const result = await getPackageDependencyKeys(process.cwd(), externals);

    expect(result).toEqual(['react', 'react-dom', 'typescript']);
  });
});
