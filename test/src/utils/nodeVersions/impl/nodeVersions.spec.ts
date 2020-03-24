import moment = require('moment');
import { NodeVersions } from '../../../../../src/utils/nodeVersions/impl/nodeVersions';
import { Axios } from '../../../../../src/container/nodeModulesContainer';
import { mock, mockReset } from 'jest-mock-extended';
import { ILogger } from '../../../../../src/utils/logger/interfaces/ILogger';
import { ILoggerFactory } from '../../../../../src/utils/logger';

const dateFormat = `YYYY-MM-DD`;

describe(`node versions`, () => {
  const nodeReleaseVersions = {
    'v0.10': {
      start: `2013-03-11`,
      end: `2016-10-31`,
    },
    'v0.12': {
      start: `2015-02-06`,
      end: `2016-12-31`,
    },
    v4: {
      start: `2015-09-08`,
      lts: `2015-10-12`,
      maintenance: `2017-04-01`,
      end: `2018-04-30`,
      codename: `Argon`,
    },
    v5: {
      start: `2015-10-29`,
      maintenance: `2016-04-30`,
      end: `2016-06-30`,
    },
    v6: {
      start: `2016-04-26`,
      lts: `2016-10-18`,
      maintenance: `2018-04-30`,
      end: `2019-04-30`,
      codename: `Boron`,
    },
    v7: {
      start: `2016-10-25`,
      maintenance: `2017-04-30`,
      end: `2017-06-30`,
    },
    v8: {
      start: `2017-05-30`,
      lts: `2017-10-31`,
      maintenance: `2019-01-01`,
      end: `2019-12-31`,
      codename: `Carbon`,
    },
    v9: {
      start: `2017-10-01`,
      maintenance: `2018-04-01`,
      end: `2018-06-30`,
    },
    v10: {
      start: `2018-04-24`,
      lts: `2018-10-30`,
      maintenance: `2020-04-30`,
      end: `2021-04-30`,
      codename: `Dubnium`,
    },
    v11: {
      start: `2018-10-23`,
      maintenance: `2019-04-22`,
      end: `2019-06-01`,
    },
    v12: {
      start: `2019-04-23`,
      lts: `2019-10-21`,
      maintenance: `2020-10-20`,
      end: `2022-04-30`,
      codename: `Erbium`,
    },
    v13: {
      start: `2019-10-22`,
      maintenance: `2020-04-01`,
      end: `2020-06-01`,
    },
    v14: {
      start: `2020-04-21`,
      lts: `2020-10-20`,
      maintenance: `2021-10-19`,
      end: `2023-04-30`,
      codename: ``,
    },
  };

  const axiosMock = mock<Axios>();
  let nodeVersions: NodeVersions;
  const loggerMock = mock<ILogger>();
  const loggerFactoryMock = mock<ILoggerFactory>();
  loggerFactoryMock.getLogger.mockReturnValue(loggerMock);

  beforeEach(() => {
    mockReset(loggerMock);
    mockReset(axiosMock);
    axiosMock.get.mockResolvedValue({
      data: nodeReleaseVersions,
    });
    nodeVersions = new NodeVersions(axiosMock, loggerFactoryMock);
  });

  describe(`stable`, () => {
    it(`should throw if fails to locate versions from remote url`, async () => {
      mockReset(axiosMock);
      axiosMock.get.mockRejectedValue(new Error(`failed to fetch`));
      const promise = nodeVersions.resolveStableVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to fetch node release versions`,
      });
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should cache remote versions result`, async () => {
      await nodeVersions.resolveStableVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      await nodeVersions.resolveStableVersion({
        date: moment.utc(`2015-10-03`, dateFormat),
      });
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should cache versions result`, async () => {
      const res1 = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      const res2 = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      const res3 = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2017-10-03`, dateFormat),
      });
      expect(res1).toBe(res2);
      expect(res2).not.toBe(res3);
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should resolve to node 4`, async () => {
      const versions = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      expect(versions).toEqual(`4`);
    });

    it(`should resolve to node 6`, async () => {
      const versions = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2016-10-19`, dateFormat),
      });
      expect(versions).toEqual(`6`);
    });

    it(`should resolve to node 8`, async () => {
      const versions = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2017-11-01`, dateFormat),
      });
      expect(versions).toEqual(`8`);
    });

    it(`should resolve to node 10`, async () => {
      const versions = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2018-11-01`, dateFormat),
      });
      expect(versions).toEqual(`10`);
    });

    it(`should resolve to node 12`, async () => {
      const versions = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2019-10-23`, dateFormat),
      });
      expect(versions).toEqual(`12`);
    });

    it(`should resolve to node 14`, async () => {
      const versions = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2020-10-21`, dateFormat),
      });
      expect(versions).toEqual(`14`);
    });

    it(`should not resolve`, async () => {
      const versions = await nodeVersions.resolveStableVersion({
        date: moment.utc(`2050-10-21`, dateFormat),
      });
      expect(versions).toEqual(undefined);
      expect(loggerMock.error).toHaveBeenCalledWith(`Failed to resolve stable version in 2050-10-21T00:00:00.000Z`);
    });
  });

  describe(`latest lts`, () => {
    it(`should throw if fails to locate versions from remote url`, async () => {
      mockReset(axiosMock);
      axiosMock.get.mockRejectedValue(new Error(`failed to fetch`));
      const promise = nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to fetch node release versions`,
      });
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should cache remote versions result`, async () => {
      const res1 = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      const res2 = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      const res3 = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2017-10-03`, dateFormat),
      });
      expect(res1).toBe(res2);
      expect(res2).not.toBe(res3);
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should cache versions result`, async () => {
      await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2015-10-02`, dateFormat),
      });
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should resolve to node 4`, async () => {
      const versions = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2016-04-27`, dateFormat),
      });
      expect(versions).toEqual(`4`);
    });

    it(`should resolve to node 6`, async () => {
      const versions = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2017-06-01`, dateFormat),
      });
      expect(versions).toEqual(`6`);
    });

    it(`should resolve to node 8`, async () => {
      const versions = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2018-04-25`, dateFormat),
      });
      expect(versions).toEqual(`8`);
    });

    it(`should resolve to node 10`, async () => {
      const versions = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2019-04-24`, dateFormat),
      });
      expect(versions).toEqual(`10`);
    });

    it(`should resolve to node 12`, async () => {
      const versions = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2020-04-25`, dateFormat),
      });
      expect(versions).toEqual(`12`);
    });

    it(`should resolve to node 14`, async () => {
      const versions = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2020-10-21`, dateFormat),
      });
      expect(versions).toEqual(`14`);
    });

    it(`should not resolve`, async () => {
      const versions = await nodeVersions.resolveLatestLtsVersion({
        date: moment.utc(`2050-10-21`, dateFormat),
      });
      expect(versions).toEqual(undefined);
      expect(loggerMock.error).toHaveBeenCalledWith(`Failed to resolve latest lts version in 2050-10-21T00:00:00.000Z`);
    });
  });

  describe(`lts`, () => {
    it(`should throw if fails to locate versions from remote url`, async () => {
      mockReset(axiosMock.get);
      axiosMock.get.mockRejectedValue(new Error(`failed to fetch`));
      const promise = nodeVersions.resolveLtsVersion({
        codename: `Argon`,
      });
      await expect(promise).rejects.toBeInstanceOf(Error);
      await expect(promise).rejects.toMatchObject({
        message: `Failed to fetch node release versions`,
      });
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should cache remote versions result`, async () => {
      await nodeVersions.resolveLtsVersion({
        codename: `Argon`,
      });
      await nodeVersions.resolveLtsVersion({
        codename: `argon`,
      });
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should cache versions result`, async () => {
      const res1 = await nodeVersions.resolveLtsVersion({
        codename: `Argon`,
      });
      const res2 = await nodeVersions.resolveLtsVersion({
        codename: `Argon`,
      });
      const res3 = await nodeVersions.resolveLtsVersion({
        codename: `Boron`,
      });
      expect(res1).toBe(res2);
      expect(res2).not.toBe(res3);
      expect(axiosMock.get).toBeCalledTimes(1);
      expect(axiosMock.get).toHaveBeenCalledWith(
        `https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`
      );
    });

    it(`should resolve to node 4 ignore case`, async () => {
      const versions = await nodeVersions.resolveLtsVersion({
        codename: `Argon`,
      });
      expect(versions).toEqual(`4`);
    });

    it(`should resolve to node 4`, async () => {
      const versions = await nodeVersions.resolveLtsVersion({
        codename: `argon`,
      });
      expect(versions).toEqual(`4`);
    });

    it(`should resolve to node 6`, async () => {
      const versions = await nodeVersions.resolveLtsVersion({
        codename: `Boron`,
      });
      expect(versions).toEqual(`6`);
    });

    it(`should resolve to node 8`, async () => {
      const versions = await nodeVersions.resolveLtsVersion({
        codename: `Carbon`,
      });
      expect(versions).toEqual(`8`);
    });

    it(`should resolve to node 10`, async () => {
      const versions = await nodeVersions.resolveLtsVersion({
        codename: `Dubnium`,
      });
      expect(versions).toEqual(`10`);
    });

    it(`should resolve to node 12`, async () => {
      const versions = await nodeVersions.resolveLtsVersion({
        codename: `Erbium`,
      });
      expect(versions).toEqual(`12`);
    });

    it(`should not resolve`, async () => {
      const versions = await nodeVersions.resolveLtsVersion({
        codename: `dummy`,
      });
      expect(versions).toEqual(undefined);
      expect(loggerMock.error).toHaveBeenCalledWith(`Failed to resolve LTS version of dummy`);
    });
  });
});
