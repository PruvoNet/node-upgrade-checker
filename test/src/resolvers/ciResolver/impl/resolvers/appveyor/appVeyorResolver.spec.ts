/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { AppVeyorResolver } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/appveyor/appVeyorResolver';
import { FS } from '../../../../../../../src/container/nodeModulesContainer';
import { normalize } from 'path';
import { loggerFactory } from '../../../../../../common/logger';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import { AppVeyorConfigParser } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/appveyor/appVeyorConfigParser';

describe(`AppVeyor Resolver`, () => {
  const repoPath = `placeholder`;
  const fileModePlaceholder = 43345;
  const fsMock = mockDeep<FS>({
    constants: {
      R_OK: fileModePlaceholder,
    },
  });
  const parserMock = mock<AppVeyorConfigParser>();
  const appVeyorResolver = new AppVeyorResolver(fsMock, parserMock, loggerFactory);

  beforeEach(() => {
    mockReset(parserMock);
    mockReset(fsMock);
  });

  it(`should expose the proper name`, async () => {
    expect(appVeyorResolver.resolverName).toBe(`AppVeyor`);
  });

  it(`should parser config`, async () => {
    const parseResult = { nodeVersions: new Set([`4`, `6.12`]) };
    parserMock.parse.mockResolvedValue(parseResult);
    fsMock.promises.readFile.mockResolvedValue(`
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
    expect(versions).toEqual(parseResult);
    expect(fsMock.promises.readFile).toBeCalledTimes(1);
    expect(fsMock.promises.readFile).toHaveBeenCalledWith(normalize(`placeholder/.appveyor.yml`), `utf-8`);
    expect(parserMock.parse).toBeCalledTimes(1);
    expect(parserMock.parse).toHaveBeenCalledWith({
      config: {
        environment: {
          matrix: [
            {
              nodejs_version: `4`,
            },
            {
              nodejs_version: `6.12`,
            },
          ],
        },
        install: [
          {
            ps: `Install-Product node $env:nodejs_version`,
          },
        ],
      },
    });
  });

  describe(`isRelevant`, () => {
    it(`should return true from relevant repo`, async () => {
      fsMock.promises.access.mockResolvedValue(undefined);
      const result = await appVeyorResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
      expect(fsMock.promises.access).toBeCalledTimes(1);
      expect(fsMock.promises.access).toHaveBeenCalledWith(normalize(`placeholder/.appveyor.yml`), fileModePlaceholder);
    });

    it(`should return false from non relevant repo`, async () => {
      fsMock.promises.access.mockRejectedValue(new Error());
      const result = await appVeyorResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
      expect(fsMock.promises.access).toBeCalledTimes(1);
      expect(fsMock.promises.access).toHaveBeenCalledWith(normalize(`placeholder/.appveyor.yml`), fileModePlaceholder);
    });
  });
});
