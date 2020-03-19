import { ILts } from '../../../../../src/utils/lts';
import { TargetMatcher } from '../../../../../src/resolvers/ciResolver/impl/targetMatcher';
// eslint-disable-next-line @typescript-eslint/quotes
import moment = require('moment');

const dateFormat = `YYYY-MM-DD`;
const packageReleaseDate = moment.utc(`2015-10-02`, dateFormat);

describe(`target matcher`, () => {
  const resolveLtsVersionMock = jest.fn();
  const ltsMock = ({
    resolveLtsVersion: resolveLtsVersionMock,
  } as any) as ILts;
  const targetMatcher = new TargetMatcher(ltsMock);

  beforeEach(() => {
    resolveLtsVersionMock.mockReset();
  });

  it(`should match target node from candidates`, async () => {
    const result = await targetMatcher.match({
      candidates: [`6`, `8`, `10`, `11`],
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
  });

  it(`should match target node from candidates while resolving lts`, async () => {
    resolveLtsVersionMock.mockResolvedValue([`4`, `6`]);
    const result = await targetMatcher.match({
      candidates: [`LTS_VERSION`, `8`, `10`, `11`],
      targetNode: `6`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
  });

  it(`should match target node from complex candidates`, async () => {
    const result = await targetMatcher.match({
      candidates: [`6`, `8.14`, `10`, `11`],
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
  });

  it(`should match target node from complex candidates 2`, async () => {
    const result = await targetMatcher.match({
      candidates: [`6`, `8.x`, `10`, `11`],
      targetNode: `8`,
      packageReleaseDate,
    });
    expect(result).toBe(true);
  });

  it(`should not match target node from candidates`, async () => {
    const result = await targetMatcher.match({
      candidates: [`6`, `8.14`, `10`, `11`],
      targetNode: `4`,
      packageReleaseDate,
    });
    expect(result).toBe(false);
  });
});
