import { container } from '../../../../../src/container';
import { ILts } from '../../../../../src/utils/lts';
import moment from 'moment';

const dateFormat = `YYYY-MM-DD`;

describe(`lts`, () => {
  let lts: ILts;

  beforeEach(() => {
    container.snapshot();
    lts = container.get(ILts);
  });

  afterEach(() => {
    container.restore();
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
