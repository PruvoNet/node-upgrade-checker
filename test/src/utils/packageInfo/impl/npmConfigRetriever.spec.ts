import * as libnpmconfig from 'libnpmconfig';
import { loggerFactory } from '../../../../common/logger';
import { NpmConfigRetriever } from '../../../../../src/utils/packageInfo/impl/npmConfigRetriever';

describe(`npm config retriever`, () => {
  const npmConfigRetriever = new NpmConfigRetriever(libnpmconfig, loggerFactory);

  it(`should return npm config`, async () => {
    const result = await npmConfigRetriever.retrieve();
    expect(result).toEqual({});
  });
});
