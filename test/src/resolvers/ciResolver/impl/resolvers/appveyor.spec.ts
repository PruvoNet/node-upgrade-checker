import { AppVeyorResolver } from '../../../../../../src/resolvers/ciResolver/impl/resolvers/appveyor';
import { FS } from '../../../../../../src/container/nodeModulesContainer';
import { normalize } from 'path';

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

  it(`should get file properly`, async () => {
    fsMock.mockResolvedValue(`
environment:
  matrix:
    - nodejs_version: "4"
    - nodejs_version: "6.12"

install:
  - ps: Install-Product node $env:nodejs_version
    `);
    await appVeyorResolver.resolve({
      repoPath,
    });
    expect(fsMock).toBeCalledTimes(1);
    expect(fsMock).toHaveBeenCalledWith(normalize(`placeholder/.appveyor.yml`), `utf-8`);
  });

  it(`should resolve node js from configuration matrix`, async () => {
    fsMock.mockResolvedValue(`
environment:
  matrix:
    - nodejs_version: "4"
    - nodejs_version: "6.12"

install:
  - ps: Install-Product node $env:nodejs_version
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`4`, `6.12`]);
  });

  it(`should return empty array if fails to find env element`, async () => {
    fsMock.mockResolvedValue(`
install:
  - ps: Install-Product node $env:nodejs_version
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([]);
  });

  it(`should return empty array if fails to find env variable`, async () => {
    fsMock.mockResolvedValue(`
environment:
  matrix:
    - foo: 4

install:
  - ps: Install-Product node $env:nodejs_version
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([]);
  });

  it(`should resolve node js from configuration environment`, async () => {
    fsMock.mockResolvedValue(`
environment:
  - nodejs_version: "4"
  - nodejs_version: "6.12"

install:
  - ps: Install-Product node $env:nodejs_version
  - sh: dummy command
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`4`, `6.12`]);
  });

  it(`should resolve node js from configuration environment with stack that has no node version in it`, async () => {
    fsMock.mockResolvedValue(`
stack: mysql
environment:
  - nodejs_version: "4"
  - nodejs_version: "6.12"

install:
  - ps: Install-Product node $env:nodejs_version
  - fds: dummy command
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`4`, `6.12`]);
  });

  it(`should resolve node js from ps install command`, async () => {
    fsMock.mockResolvedValue(`
install:
  - ps: Install-Product node 8.12 x64
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`8.12`]);
  });

  it(`should resolve node js from cmd install command`, async () => {
    fsMock.mockResolvedValue(`
install:
  - cmd: powershell Install-Product node 8.12 x64
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`8.12`]);
  });

  it(`should resolve node js from nvm install command`, async () => {
    fsMock.mockResolvedValue(`
install:
  - sh: nvm install 8.12
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`8.12`]);
  });

  it(`should resolve node js from nvm install command and stack`, async () => {
    fsMock.mockResolvedValue(`
stack: node 9
install:
  - sh: nvm install 8.12
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`9`, `8.12`]);
  });

  it(`should resolve node js from stack configuration`, async () => {
    fsMock.mockResolvedValue(`
stack: mysql, node 8.12
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([`8.12`]);
  });

  it(`should return empty array when failed to find install commands`, async () => {
    fsMock.mockResolvedValue(`
install:
  - ps: Install-Product bash
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([]);
  });

  it(`should return empty array when no install element`, async () => {
    fsMock.mockResolvedValue(`
init:
  - ps: Install-Product bash
    `);
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual([]);
  });

  it(`should return undefined from non relevant repo`, async () => {
    fsMock.mockRejectedValue(new Error());
    const versions = await appVeyorResolver.resolve({
      repoPath,
    });
    expect(versions).toBeFalsy();
  });
});
