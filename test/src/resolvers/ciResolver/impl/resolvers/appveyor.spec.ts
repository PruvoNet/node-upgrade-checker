import { AppVeyorResolver } from '../../../../../../src/resolvers/ciResolver/impl/resolvers/appveyor';
import { FS } from '../../../../../../src/container/nodeModulesContainer';

describe(`appveyor`, () => {
  const repoPath = `placeholder`;
  const fsMock = jest.fn();
  const fsSpy = ({
    promises: {
      readFile: fsMock,
    },
  } as any) as FS;
  const appVeyorResolver = new AppVeyorResolver(fsSpy);

  beforeEach(() => {
    fsMock.mockReset();
  });

  it(`should expose the proper name`, async () => {
    expect(appVeyorResolver.resolverName).toBe(`appVeyor`);
  });

  it(`should resolve node js from travis configuration matrix`, async () => {
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`4`, `6`, `1.0`]);
  });

  it(`should resolve node js from travis configuration`, async () => {
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`8`]);
  });

  it(`should throw due to faulty configuration`, async () => {
    const promise = appVeyorResolver.resolve({
      repoPath,
    });
    await expect(promise).rejects.toBeInstanceOf(Error);
  });

  it(`should return undefined from non relevant repo`, async () => {
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toBeFalsy();
  });
});
