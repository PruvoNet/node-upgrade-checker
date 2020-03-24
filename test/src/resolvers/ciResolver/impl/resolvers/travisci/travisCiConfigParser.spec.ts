/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { loggerFactory } from '../../../../../../common/logger';
import { TravisCiConfigParser } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/travisci/travisCiConfigParser';
import { mock, mockReset } from 'jest-mock-extended';
import { ITargetMatcher } from '../../../../../../../src/resolvers/ciResolver';
import { when } from 'jest-when';
import { NvmHandler } from '../../../../../../../src/resolvers/ciResolver/impl/nvmHandler';

describe(`Travis CI Config Parser`, () => {
  const stablePlaceholder = `__STABLE__`;
  const latestLtsPlaceholder = `__LTS*__`;
  const ltsPlaceholder = `__LTS__`;
  const ltsVersion = `lts/dummy`;
  const targetMatcherMock = mock<ITargetMatcher>();
  const nvmHandler = new NvmHandler(targetMatcherMock);
  const travisCiConfigParser = new TravisCiConfigParser(nvmHandler, targetMatcherMock, loggerFactory);

  beforeEach(() => {
    mockReset(targetMatcherMock);
    targetMatcherMock.getStableVersionPlaceholder.mockReturnValue(stablePlaceholder);
    targetMatcherMock.getLatestLtsVersionPlaceholder.mockReturnValue(latestLtsPlaceholder);
    when(targetMatcherMock.getLtsVersionPlaceholder).calledWith({ codename: `dummy` }).mockReturnValue(ltsPlaceholder);
  });

  it(`should resolve node js number`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        node_js: 8,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`8`]) });
    expect(targetMatcherMock.getStableVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
  });

  it(`should resolve node from nvm command (string)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        before_install: `nvm install 8`,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`8`]) });
  });

  it(`should resolve node from nvm command (array)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        before_install: [`nvm install 8`],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`8`]) });
  });

  it(`should resolve node from nvm command (env string)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        env: `NODE=6 BLA="foo bar"`,
        before_install: [`nvm install "\${NODE}"`],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`6`]) });
  });

  it(`should resolve node from nvm command (env array)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        env: [`NODE=6 BLA="foo bar"`],
        before_install: [`nvm install "\${NODE}"`],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`6`]) });
  });

  it(`should resolve node from nvm command (env matrix)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        env: [`NODE=6 BLA="foo bar"`, `NODE=8 BLA="foo bar"`],
        before_install: [`nvm install "\${NODE}"`],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`6`, `8`]) });
  });

  it(`should resolve node from nvm command (env matrix object)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        env: { matrix: [`NODE=6 BLA="foo bar"`, `NODE=8 BLA="foo bar"`] },
        before_install: [`nvm install "\${NODE}"`],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`6`, `8`]) });
  });

  it(`should resolve node from nvm command (complex env matrix object)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        env: { matrix: [`NODE=6 BLA="foo bar"`, `NODE=8 BLA="foo bar" || X=1`] },
        before_install: [`nvm install "\${NODE}"`],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`6`, `8`]) });
  });

  it(`should not resolve node from bad nvm command`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        before_install: [`nvm install --dummy`],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set() });
  });

  it(`should resolve node js string`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        node_js: `8`,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`8`]) });
    expect(targetMatcherMock.getStableVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
  });

  it(`should resolve node js stable`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        node_js: `stable`,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([stablePlaceholder]) });
    expect(targetMatcherMock.getStableVersionPlaceholder).toHaveBeenCalledTimes(1);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
  });

  it(`should resolve node js stable v2`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        node_js: `node`,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([stablePlaceholder]) });
    expect(targetMatcherMock.getStableVersionPlaceholder).toHaveBeenCalledTimes(1);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
  });

  it(`should resolve node js lts`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        node_js: ltsVersion,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([ltsPlaceholder]) });
    expect(targetMatcherMock.getStableVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledTimes(1);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledWith({ codename: `dummy` });
  });

  it(`should resolve node js lts star`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        node_js: `lts/*`,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([latestLtsPlaceholder]) });
    expect(targetMatcherMock.getStableVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledTimes(1);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledTimes(0);
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledWith();
  });

  it(`should resolve node js list`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        node_js: [ltsVersion, `node`, `stable`, `8`, `lts/*`, 10],
      },
    });
    expect(versions).toEqual({
      nodeVersions: new Set([ltsPlaceholder, stablePlaceholder, `8`, latestLtsPlaceholder, `10`]),
    });
    expect(targetMatcherMock.getStableVersionPlaceholder).toHaveBeenCalledTimes(2);
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledTimes(1);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledTimes(1);
    expect(targetMatcherMock.getLtsVersionPlaceholder).toHaveBeenCalledWith({ codename: `dummy` });
    expect(targetMatcherMock.getStableVersionPlaceholder).toHaveBeenCalledWith();
    expect(targetMatcherMock.getLatestLtsVersionPlaceholder).toHaveBeenCalledWith();
  });

  it(`should return empty array when failed to find node js`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        version: 2.1,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });

  it(`should return empty array when failed to find node js (bad formatting)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        version: 2.1,
        node_js: [true],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });

  it(`should return empty array when failed to find node js (bad formatting 2)`, async () => {
    const versions = await travisCiConfigParser.parse({
      config: {
        version: 2.1,
        node_js: true,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });
});
