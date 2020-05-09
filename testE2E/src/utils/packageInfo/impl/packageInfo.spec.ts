import { container } from '../../../../../src/container';
import { IPackageInfo } from '../../../../../src/utils/packageInfo';
import moment = require('moment');

describe(`package info e2e`, () => {
  const packageInfo = container.get(IPackageInfo);

  it(`should resolve package version properly`, async () => {
    const result = await packageInfo.resolvePackageVersion({
      name: `@pruvo/common`,
      semver: `~1.0.0`,
    });
    expect(result).toEqual(`3.0.1`);
  }, 30000);

  it(`should resolve package info properly`, async () => {
    const result = await packageInfo.getPackageInfo({
      name: `squiss-ts`,
      version: `3.0.1`,
    });
    expect(result).toEqual({
      name: `squiss-ts`,
      version: `3.0.1`,
      engines: `>=6`,
      repoUrl: `git+https://github.com/PruvoNet/squiss-ts.git`,
      commitSha: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
      releaseDate: moment.utc(`2019-05-18T11:28:56.320Z`),
    });
  }, 30000);
});
