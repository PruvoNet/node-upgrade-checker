import { INodeVersions } from '../../../../../src/utils/nodeVersions';
import { TargetMatcher } from '../../../../../src/resolvers/ciResolver/impl/targetMatcher';
import moment = require('moment');
import { loggerFactory } from '../../../../common/logger';
import { mock, mockReset } from 'jest-mock-extended';

const dateFormat = `YYYY-MM-DD`;
const packageReleaseDate = moment.utc(`2015-10-02`, dateFormat);

describe(`target matcher`, () => {
  const nodeVersionsMock = mock<INodeVersions>();
  const targetMatcher = new TargetMatcher(nodeVersionsMock, loggerFactory);

  beforeEach(() => {
    mockReset(nodeVersionsMock);
  });

  it(`should not match on invalid target version`, async () => {
    const promise = targetMatcher.match({
      candidates: new Set([`8`]),
      targetNode: `foo`,
      packageReleaseDate,
    });
    await expect(promise).rejects.toBeInstanceOf(TypeError);
    await expect(promise).rejects.toMatchObject({
      message: expect.stringContaining(`Node target version foo is not valid`),
    });
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
  });

  it(`should not match on invalid version`, async () => {
    const result = await targetMatcher.match({
      candidates: new Set([`foo`]),
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(false);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
  });

  it(`should match target node from candidates`, async () => {
    const result = await targetMatcher.match({
      candidates: new Set([`6`, `8`, `10`, `11`]),
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
  });

  it(`should match target node from candidates while resolving stable`, async () => {
    nodeVersionsMock.resolveStableVersion.mockResolvedValue(`6`);
    const result = await targetMatcher.match({
      candidates: new Set([targetMatcher.getStableVersionPlaceholder(), `8`, `10`, `11`]),
      targetNode: `6`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(1);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledWith({
      date: packageReleaseDate,
    });
  });

  it(`should match target node from candidates while resolving stable failed`, async () => {
    nodeVersionsMock.resolveStableVersion.mockResolvedValue(undefined);
    const result = await targetMatcher.match({
      candidates: new Set([targetMatcher.getStableVersionPlaceholder(), `8`, `10`, `11`]),
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(1);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledWith({
      date: packageReleaseDate,
    });
  });

  it(`should match target node from candidates while resolving latest lts`, async () => {
    nodeVersionsMock.resolveLatestLtsVersion.mockResolvedValue(`6`);
    const result = await targetMatcher.match({
      candidates: new Set([targetMatcher.getLatestLtsVersionPlaceholder(), `8`, `10`, `11`]),
      targetNode: `6`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(1);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledWith({
      date: packageReleaseDate,
    });
  });

  it(`should match target node from candidates while resolving latest lts failed`, async () => {
    nodeVersionsMock.resolveLatestLtsVersion.mockResolvedValue(undefined);
    const result = await targetMatcher.match({
      candidates: new Set([targetMatcher.getLatestLtsVersionPlaceholder(), `8`, `10`, `11`]),
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(1);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledWith({
      date: packageReleaseDate,
    });
  });

  it(`should match target node from candidates while resolving lts`, async () => {
    nodeVersionsMock.resolveLtsVersion.mockResolvedValue(`6`);
    const result = await targetMatcher.match({
      candidates: new Set([targetMatcher.getLtsVersionPlaceholder({ codename: `born` }), `8`, `10`, `11`]),
      targetNode: `6`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(1);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledWith({
      codename: `born`,
    });
  });

  it(`should match target node from candidates while resolving lts failed`, async () => {
    nodeVersionsMock.resolveLtsVersion.mockResolvedValue(undefined);
    const result = await targetMatcher.match({
      candidates: new Set([targetMatcher.getLtsVersionPlaceholder({ codename: `born` }), `8`, `10`, `11`]),
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(1);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledWith({
      codename: `born`,
    });
  });

  it(`should match target node from complex candidates`, async () => {
    const result = await targetMatcher.match({
      candidates: new Set([`6`, `8.14`, `10`, `11`]),
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
  });

  it(`should match target node from complex candidates 2`, async () => {
    const result = await targetMatcher.match({
      candidates: new Set([`6`, `8.x`, `10`, `11`]),
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
  });

  it(`should not match target node from candidates`, async () => {
    const result = await targetMatcher.match({
      candidates: new Set([`6`, `8.14`, `10`, `11`]),
      targetNode: `4`,
      packageReleaseDate,
    });
    expect(result).toBe(false);
    expect(nodeVersionsMock.resolveStableVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLtsVersion).toHaveBeenCalledTimes(0);
    expect(nodeVersionsMock.resolveLatestLtsVersion).toHaveBeenCalledTimes(0);
  });
});
