import { PackageInfo } from '../../../../../src/utils/packageInfo/impl/packageInfo';
import { Pacote } from '../../../../../src/container/nodeModulesContainer';
import { loggerFactory } from '../../../../common/logger';
import { mock, mockReset } from 'jest-mock-extended';
import { PackageDist } from 'pacote';
import moment = require('moment');
import { when } from 'jest-when';

describe(`package info`, () => {
  const pacoteMock = mock<Pacote>();
  let packageInfo: PackageInfo;

  beforeEach(() => {
    mockReset(pacoteMock);
    packageInfo = new PackageInfo(pacoteMock, loggerFactory);
  });

  it(`should cache package resolved version`, async () => {
    pacoteMock.manifest.mockResolvedValue({
      version: `3.0.1`,
      _from: `_from`,
      _resolved: `_resolved`,
      _integrity: `_integrity`,
      name: `name`,
      dist: mock<PackageDist>(),
    });
    const result = await packageInfo.resolvePackageVersion({
      name: `squiss-ts`,
      semver: `~3.0.0`,
    });
    const result2 = await packageInfo.resolvePackageVersion({
      name: `squiss-ts`,
      semver: `~3.0.0`,
    });
    expect(result).toBe(result2);
    expect(pacoteMock.manifest.mock.calls.length).toBe(1);
  });

  it(`should resolve package version`, async () => {
    when(pacoteMock.manifest)
      .calledWith(`squiss-ts@~3.0.0`, {
        fullMetadata: false,
      })
      .mockResolvedValue({
        version: `3.0.1`,
        _from: `_from`,
        _resolved: `_resolved`,
        _integrity: `_integrity`,
        name: `name`,
        dist: mock<PackageDist>(),
      });
    const result = await packageInfo.resolvePackageVersion({
      name: `squiss-ts`,
      semver: `~3.0.0`,
    });
    expect(result).toBe(`3.0.1`);
  });

  it(`should cache package info`, async () => {
    pacoteMock.packument.mockResolvedValue({
      name: `name`,
      'dist-tags': {
        latest: ``,
      },
      versions: {
        '3.0.1': {
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
        },
      },
      time: {
        created: ``,
        modified: ``,
        '3.0.1': `2019-05-18T11:28:56.320Z`,
      },
    });
    const result = await packageInfo.getPackageInfo({
      name: `squiss-ts`,
      version: `3.0.1`,
    });
    const result2 = await packageInfo.getPackageInfo({
      name: `squiss-ts`,
      version: `3.0.1`,
    });
    expect(result).toBe(result2);
    expect(pacoteMock.packument.mock.calls.length).toBe(1);
  });

  it(`should resolve package info properly`, async () => {
    when(pacoteMock.packument)
      .calledWith(`squiss-ts`, {
        fullMetadata: true,
      })
      .mockResolvedValue({
        name: `name`,
        'dist-tags': {
          latest: ``,
        },
        versions: {
          '3.0.1': {
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
          },
        },
        time: {
          created: ``,
          modified: ``,
          '3.0.1': `2019-05-18T11:28:56.320Z`,
        },
      });
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
  });

  it(`should resolve package info properly when bad time format`, async () => {
    when(pacoteMock.packument)
      .calledWith(`squiss-ts`, {
        fullMetadata: true,
      })
      .mockResolvedValue({
        name: `name`,
        'dist-tags': {
          latest: ``,
        },
        versions: {
          '3.0.1': {
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
          },
        },
        time: {
          created: ``,
          modified: ``,
          '3.0.1': `dummy`,
        },
      });
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
    });
  });

  it(`should resolve package info properly when no time data`, async () => {
    when(pacoteMock.packument)
      .calledWith(`squiss-ts`, {
        fullMetadata: true,
      })
      .mockResolvedValue({
        name: `name`,
        'dist-tags': {
          latest: ``,
        },
        versions: {
          '3.0.1': {
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
          },
        },
      });
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
    });
  });

  it(`should resolve package info properly when no repo data`, async () => {
    when(pacoteMock.packument)
      .calledWith(`squiss-ts`, {
        fullMetadata: true,
      })
      .mockResolvedValue({
        name: `name`,
        'dist-tags': {
          latest: ``,
        },
        versions: {
          '3.0.1': {
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
          },
        },
        time: {
          created: ``,
          modified: ``,
          '3.0.1': `2019-05-18T11:28:56.320Z`,
        },
      });
    const result = await packageInfo.getPackageInfo({
      name: `squiss-ts`,
      version: `3.0.1`,
    });
    expect(result).toEqual({
      name: `squiss-ts`,
      version: `3.0.1`,
      engines: `>=6`,
      commitSha: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
      releaseDate: moment.utc(`2019-05-18T11:28:56.320Z`),
    });
  });

  it(`should resolve package info properly when no engines data`, async () => {
    when(pacoteMock.packument)
      .calledWith(`squiss-ts`, {
        fullMetadata: true,
      })
      .mockResolvedValue({
        name: `name`,
        'dist-tags': {
          latest: ``,
        },
        versions: {
          '3.0.1': {
            version: `3.0.1`,
            repository: {
              url: `git+https://github.com/PruvoNet/squiss-ts.git`,
              directory: `dir1/dir2`,
            },
            gitHead: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
            _from: `_from`,
            _resolved: `_resolved`,
            _integrity: `_integrity`,
            name: `name`,
            dist: mock<PackageDist>(),
          },
        },
        time: {
          created: ``,
          modified: ``,
          '3.0.1': `2019-05-18T11:28:56.320Z`,
        },
      });
    const result = await packageInfo.getPackageInfo({
      name: `squiss-ts`,
      version: `3.0.1`,
    });
    expect(result).toEqual({
      name: `squiss-ts`,
      version: `3.0.1`,
      repoUrl: `git+https://github.com/PruvoNet/squiss-ts.git`,
      commitSha: `5cd3e98b5236ce93bb522a893a7e09fd4de1e39b`,
      releaseDate: moment.utc(`2019-05-18T11:28:56.320Z`),
      repoDirectory: `dir1/dir2`,
    });
  });
});
