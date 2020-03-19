import { AppVeyorResolver } from '../../../../../../src/resolvers/ciResolver/impl/resolvers/appveyor';
import * as path from 'path';
import * as fs from 'fs';
import { resourcesDir } from '../../../../../common';

describe(`appveyor`, () => {
  let appVeyorResolver: AppVeyorResolver;

  beforeEach(() => {
    appVeyorResolver = new AppVeyorResolver(fs);
  });

  it(`should expose the proper name`, async () => {
    expect(appVeyorResolver.resolverName).toBe(`appVeyor`);
  });

  it(`should resolve node js from travis configuration matrix`, async () => {
    const repoPath = path.join(resourcesDir, `appveyor`);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`4`, `6`, `1.0`]);
  });

  it(`should resolve node js from travis configuration`, async () => {
    const repoPath = path.join(resourcesDir, `appveyor2`);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`8`]);
  });

  it(`should throw due to faulty configuration`, async () => {
    const repoPath = path.join(resourcesDir, `appveyorFaulty`);
    const promise = appVeyorResolver.resolve({
      repoPath,
    });
    await expect(promise).rejects.toBeInstanceOf(Error);
  });

  it(`should return undefined from non relevant repo`, async () => {
    const repoPath = path.join(resourcesDir, `empty`);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toBeFalsy();
  });
});
