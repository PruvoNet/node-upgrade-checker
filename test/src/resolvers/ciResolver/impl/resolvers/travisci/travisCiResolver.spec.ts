/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { FS } from '../../../../../../../src/container/nodeModulesContainer';
import { normalize } from 'path';
import { loggerFactory } from '../../../../../../common/logger';
import { TravisCiResolver } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/travisci/travisCiResolver';
import { TravisCiConfigParser } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/travisci/travisCiConfigParser';
import { mock, mockReset, mockDeep } from 'jest-mock-extended';

describe(`Travis CI Resolver`, () => {
  const repoPath = `placeholder`;
  const fileModePlaceholder = 43345;
  const fsMock = mockDeep<FS>({
    constants: {
      R_OK: fileModePlaceholder,
    },
  });
  const parserMock = mock<TravisCiConfigParser>();
  const travisCiResolver = new TravisCiResolver(fsMock, parserMock, loggerFactory);

  beforeEach(() => {
    mockReset(parserMock);
    mockReset(fsMock);
  });

  it(`should expose the proper name`, async () => {
    expect(travisCiResolver.resolverName).toBe(`TravisCi`);
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
    const versions = await travisCiResolver.resolve({
      repoPath,
    });
    expect(versions).toEqual(parseResult);
    expect(fsMock.promises.readFile).toBeCalledTimes(1);
    expect(fsMock.promises.readFile).toHaveBeenCalledWith(normalize(`placeholder/.travis.yml`), `utf-8`);
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
      const result = await travisCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
      expect(fsMock.promises.access).toBeCalledTimes(1);
      expect(fsMock.promises.access).toHaveBeenCalledWith(normalize(`placeholder/.travis.yml`), fileModePlaceholder);
    });

    it(`should return false from non relevant repo`, async () => {
      fsMock.promises.access.mockRejectedValue(new Error());
      const result = await travisCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
      expect(fsMock.promises.access).toBeCalledTimes(1);
      expect(fsMock.promises.access).toHaveBeenCalledWith(normalize(`placeholder/.travis.yml`), fileModePlaceholder);
    });
  });
});
