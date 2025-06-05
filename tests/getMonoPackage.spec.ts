import { getPackages } from '@manypkg/get-packages';

describe('getMonoPackages', () => {
  it('should return the mono package', async () => {
    const { packages } = await getPackages(process.cwd());
    expect(packages).toBeDefined();
    expect(packages.length).toBe(1);
    expect(packages[0].packageJson.name).toBe('@hyperse/config-loader');
  });
});
