import moment = require('moment');
import { Lts } from '../../../../../src/utils/lts/impl/lts';
import { loggerFactory } from '../../../../common/logger';
import { Axios } from '../../../../../src/container/nodeModulesContainer';

const dateFormat = `YYYY-MM-DD`;

describe(`lts`, () => {
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

  const getMock = jest.fn();
  const axiosSpy = {
    get: getMock,
  };
  let lts: Lts;

  beforeEach(() => {
    getMock.mockReset();
    getMock.mockResolvedValue({
      data: nodeReleaseVersions,
    });
    lts = new Lts((axiosSpy as any) as Axios, loggerFactory);
  });

  it(`should throw if fails to locate versions from remote url`, async () => {
    getMock.mockReset();
    getMock.mockRejectedValue(new Error(`failed to fetch`));
    const promise = lts.resolveLtsVersion({
      date: moment.utc(`2015-10-02`, dateFormat),
    });
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: `Failed to fetch node release versions`,
    });
    expect(getMock).toBeCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith(`https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`);
  });

  it(`should cache versions result`, async () => {
    await lts.resolveLtsVersion({
      date: moment.utc(`2015-10-02`, dateFormat),
    });
    await lts.resolveLtsVersion({
      date: moment.utc(`2015-10-02`, dateFormat),
    });
    expect(getMock).toBeCalledTimes(1);
    expect(getMock).toHaveBeenCalledWith(`https://raw.githubusercontent.com/nodejs/Release/master/schedule.json`);
  });

  it(`should resolve to node 4`, async () => {
    const versions = await lts.resolveLtsVersion({
      date: moment.utc(`2015-10-02`, dateFormat),
    });
    expect(versions).toEqual([`4`]);
  });

  it(`should resolve to node 4 & 6`, async () => {
    const versions = await lts.resolveLtsVersion({
      date: moment.utc(`2016-10-19`, dateFormat),
    });
    expect(versions).toEqual([`4`, `6`]);
  });

  it(`should resolve to node 4 & 6 & 8`, async () => {
    const versions = await lts.resolveLtsVersion({
      date: moment.utc(`2017-11-01`, dateFormat),
    });
    expect(versions).toEqual([`4`, `6`, `8`]);
  });

  it(`should resolve to node 6 & 8 & 10`, async () => {
    const versions = await lts.resolveLtsVersion({
      date: moment.utc(`2018-11-01`, dateFormat),
    });
    expect(versions).toEqual([`6`, `8`, `10`]);
  });

  it(`should resolve to node 8 & 10 && 12`, async () => {
    const versions = await lts.resolveLtsVersion({
      date: moment.utc(`2019-10-23`, dateFormat),
    });
    expect(versions).toEqual([`8`, `10`, `12`]);
  });

  it(`should resolve to node 10 && 12 && 14`, async () => {
    const versions = await lts.resolveLtsVersion({
      date: moment.utc(`2020-10-21`, dateFormat),
    });
    expect(versions).toEqual([`10`, `12`, `14`]);
  });
});
