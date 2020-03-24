// eslint-disable-next-line @typescript-eslint/quotes
import moment = require('moment');
import { container } from '../../../../../src/container';
import { INodeVersions } from '../../../../../src/utils/nodeVersions';

const dateFormat = `YYYY-MM-DD`;

describe(`node versions`, () => {
  const nodeVersions = container.get(INodeVersions);

  describe(`stable`, () => {
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
    });
  });

  describe(`latest lts`, () => {
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
    });
  });

  describe(`lts`, () => {
    it(`should resolve to node 4`, async () => {
      const versions = await nodeVersions.resolveLtsVersion({
        codename: `Argon`,
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
    });
  });
});
