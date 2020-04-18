import { EnginesResolver } from '../../../../../src/resolvers/enginesResolver/impl/enginesResolver';
import { mock, mockClear } from 'jest-mock-extended';
import { INodeVersions } from '../../../../../src/utils/nodeVersions';
import moment = require('moment');
import { when } from 'jest-when';

describe(`engines resolver`, () => {
  const nodeVersionsMock = mock<INodeVersions>();
  const enginesResolver = new EnginesResolver(nodeVersionsMock);
  const releaseDate = moment.utc(`2010-01-01`);

  beforeEach(() => {
    mockClear(nodeVersionsMock);
  });

  it(`should throw if invalid target`, async () => {
    const promise = enginesResolver.resolve({
      engines: `>=8`,
      targetNode: `foo`,
      releaseDate: undefined,
    });
    await expect(promise).rejects.toBeInstanceOf(TypeError);
    await expect(promise).rejects.toMatchObject({
      message: expect.stringContaining(`Node target version foo is not valid`),
    });
  });

  it(`should throw if invalid engines`, async () => {
    const promise = enginesResolver.resolve({
      engines: `foo`,
      targetNode: `8`,
      releaseDate: undefined,
    });
    await expect(promise).rejects.toBeInstanceOf(TypeError);
    await expect(promise).rejects.toMatchObject({
      message: expect.stringContaining(`Engines range foo is not valid`),
    });
  });

  it(`should not match if no engines`, async () => {
    const result = await enginesResolver.resolve({
      engines: undefined,
      targetNode: `foo`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should not match if not in range`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=6 <=12`,
      targetNode: `4`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should not match if range is not complete`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=1 <=4 || >=6`,
      targetNode: `8`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should not match if range is not complete and releaseData exists but does not match`, async () => {
    when(nodeVersionsMock.resolveStableVersion)
      .calledWith({
        date: releaseDate,
      })
      .mockResolvedValue(`7`);
    const result = await enginesResolver.resolve({
      engines: `>=1 <=4 || >=6`,
      targetNode: `8`,
      releaseDate,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should match if range is not complete and releaseData exists and matches`, async () => {
    when(nodeVersionsMock.resolveStableVersion)
      .calledWith({
        date: releaseDate,
      })
      .mockResolvedValue(`10`);
    const result = await enginesResolver.resolve({
      engines: `>=1 <=4 || >=6`,
      targetNode: `8`,
      releaseDate,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if range is not complete and releaseData exists and matches exact`, async () => {
    when(nodeVersionsMock.resolveStableVersion)
      .calledWith({
        date: releaseDate,
      })
      .mockResolvedValue(`8`);
    const result = await enginesResolver.resolve({
      engines: `>=1 <=4 || >=6`,
      targetNode: `8.14.0`,
      releaseDate,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if some of the range is incomplete`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=1 <=4 || >=6`,
      targetNode: `3`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if in range`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=6 <=12`,
      releaseDate: undefined,
      targetNode: `8`,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if in range 2`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>6 <=12`,
      targetNode: `8`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if in range equality`, async () => {
    const result = await enginesResolver.resolve({
      engines: `=8`,
      targetNode: `8`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should not match if in range strict equality`, async () => {
    const result = await enginesResolver.resolve({
      engines: `=8.0.1`,
      targetNode: `8`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should match if in range hyphen`, async () => {
    const result = await enginesResolver.resolve({
      engines: `6 - 12`,
      targetNode: `8`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if in range with specific version`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>6.1.0 <=12`,
      targetNode: `6.2.0`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if in range hyphen (using loose mode)`, async () => {
    const result = await enginesResolver.resolve({
      engines: `6.5.0a - 12`,
      targetNode: `8`,
      releaseDate: undefined,
    });
    expect(result.isMatch).toBe(true);
  });
});
