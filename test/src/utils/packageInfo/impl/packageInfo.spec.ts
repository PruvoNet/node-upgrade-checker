import { PackageInfo } from '../../../../../src/utils/packageInfo/impl/packageInfo';
import { Pacote } from '../../../../../src/container/nodeModulesContainer';
import { loggerFactory } from '../../../../common/logger';
import { mock, mockReset } from 'jest-mock-extended';
import { PackageDist } from 'pacote';

describe(`package info`, () => {
  const pacoteMock = mock<Pacote>();
  const packageInfo = new PackageInfo(pacoteMock, loggerFactory);

  beforeEach(() => {
    mockReset(pacoteMock);
  });

  it(`should resolve package info properly`, async () => {
    pacoteMock.manifest.mockResolvedValue({
      version: `3.0.1`,
      engines: {
        node: `>=6`,
      },
      repository: {
        url: `git+https://github.com/PruvoNet/squiss-ts.git`,
      },
      gitHead: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
      _from: `_from`,
      _resolved: `_resolved`,
      _integrity: `_integrity`,
      name: `name`,
      dist: mock<PackageDist>(),
    });
    const result = await packageInfo.getPackageInfo({
      name: `squiss-ts`,
      semver: `^3.0.0`,
    });
    expect(result).toEqual({
      name: `squiss-ts`,
      semver: `^3.0.0`,
      version: `3.0.1`,
      engines: `>=6`,
      repoUrl: `git+https://github.com/PruvoNet/squiss-ts.git`,
      commitSha: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
    });
    expect(pacoteMock.manifest.mock.calls.length).toBe(1);
    expect(pacoteMock.manifest).toHaveBeenCalledWith(`squiss-ts@^3.0.0`, {
      fullMetadata: true,
    });
  });

  it(`should resolve package info properly when no repo data`, async () => {
    pacoteMock.manifest.mockResolvedValue({
      version: `3.0.1`,
      engines: {
        node: `>=6`,
      },
      gitHead: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
      _from: `_from`,
      _resolved: `_resolved`,
      _integrity: `_integrity`,
      name: `name`,
      dist: mock<PackageDist>(),
    });
    const result = await packageInfo.getPackageInfo({
      name: `squiss-ts`,
      semver: `^3.0.0`,
    });
    expect(result).toEqual({
      name: `squiss-ts`,
      semver: `^3.0.0`,
      version: `3.0.1`,
      engines: `>=6`,
      commitSha: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
    });
    expect(pacoteMock.manifest.mock.calls.length).toBe(1);
    expect(pacoteMock.manifest.mock.calls[0].length).toBe(2);
    expect(pacoteMock.manifest.mock.calls[0][0]).toBe(`squiss-ts@^3.0.0`);
  });

  it(`should resolve package info properly when no engines data`, async () => {
    pacoteMock.manifest.mockResolvedValue({
      version: `3.0.1`,
      repository: {
        url: `git+https://github.com/PruvoNet/squiss-ts.git`,
      },
      gitHead: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
      _from: `_from`,
      _resolved: `_resolved`,
      _integrity: `_integrity`,
      name: `name`,
      dist: mock<PackageDist>(),
    });
    const result = await packageInfo.getPackageInfo({
      name: `squiss-ts`,
      semver: `^3.0.0`,
    });
    expect(result).toEqual({
      name: `squiss-ts`,
      semver: `^3.0.0`,
      version: `3.0.1`,
      repoUrl: `git+https://github.com/PruvoNet/squiss-ts.git`,
      commitSha: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
    });
    expect(pacoteMock.manifest.mock.calls.length).toBe(1);
    expect(pacoteMock.manifest.mock.calls[0].length).toBe(2);
    expect(pacoteMock.manifest.mock.calls[0][0]).toBe(`squiss-ts@^3.0.0`);
  });
});
