/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { FS } from '../../../../../../../src/container/nodeModulesContainer';
import { normalize } from 'path';
import { loggerFactory } from '../../../../../../common/logger';
import { CircleCiResolver } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/circleci/circleCiResolver';
import { when } from 'jest-when';
import { mock, mockDeep, mockReset } from 'jest-mock-extended';
import { CircleCiConfigParser } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/circleci/circleCiConfigParser';

describe(`CircleCi Resolver`, () => {
  const repoPath = `placeholder`;
  const v1FilePlaceHolder = `version: v1`;
  const v2FilePlaceHolder = `version: v2`;
  const fileModePlaceholder = 43345;
  const fsMock = mockDeep<FS>({
    constants: {
      R_OK: fileModePlaceholder,
    },
  });
  const parserMock = mock<CircleCiConfigParser>();
  const circleCiResolver = new CircleCiResolver(fsMock, parserMock, loggerFactory);

  beforeEach(() => {
    mockReset(parserMock);
    mockReset(fsMock);
  });

  it(`should expose the proper name`, async () => {
    expect(circleCiResolver.resolverName).toBe(`CircleCi`);
  });

  describe(`parse`, () => {
    it(`should parse v1 config`, async () => {
      const parseResult = { nodeVersions: new Set([`4`, `6.12`]) };
      parserMock.parse.mockResolvedValue(parseResult);
      when(fsMock.promises.readFile)
        .calledWith(normalize(`placeholder/circle.yml`), `utf-8`)
        .mockResolvedValue(v1FilePlaceHolder)
        .calledWith(normalize(`placeholder/.circleci/config.yml`), `utf-8`)
        .mockRejectedValue(new Error(`dummy`));
      const versions = await circleCiResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual(parseResult);
      expect(fsMock.promises.readFile).toBeCalledTimes(2);
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(normalize(`placeholder/circle.yml`), `utf-8`);
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(normalize(`placeholder/.circleci/config.yml`), `utf-8`);
      expect(parserMock.parse).toBeCalledTimes(1);
      expect(parserMock.parse).toHaveBeenCalledWith({
        config: {
          version: `v1`,
        },
      });
    });

    it(`should parse v2 config`, async () => {
      const parseResult = { nodeVersions: new Set([`4`, `6.12`]) };
      parserMock.parse.mockResolvedValue(parseResult);
      when(fsMock.promises.readFile)
        .calledWith(normalize(`placeholder/circle.yml`), `utf-8`)
        .mockRejectedValue(new Error(`dummy`))
        .calledWith(normalize(`placeholder/.circleci/config.yml`), `utf-8`)
        .mockResolvedValue(v2FilePlaceHolder);
      const versions = await circleCiResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual(parseResult);
      expect(fsMock.promises.readFile).toBeCalledTimes(2);
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(normalize(`placeholder/circle.yml`), `utf-8`);
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(normalize(`placeholder/.circleci/config.yml`), `utf-8`);
      expect(parserMock.parse).toBeCalledTimes(1);
      expect(parserMock.parse).toHaveBeenCalledWith({
        config: {
          version: `v2`,
        },
      });
    });

    it(`should parse both config files`, async () => {
      const v1Config = {
        config: {
          version: `v1`,
        },
      };
      const v2Config = {
        config: {
          version: `v2`,
        },
      };
      when(parserMock.parse)
        .calledWith(v1Config)
        .mockResolvedValue({ nodeVersions: new Set([`4`]) })
        .calledWith(v2Config)
        .mockResolvedValue({ nodeVersions: new Set([`6.12`]) });
      when(fsMock.promises.readFile)
        .calledWith(normalize(`placeholder/circle.yml`), `utf-8`)
        .mockResolvedValue(v1FilePlaceHolder)
        .calledWith(normalize(`placeholder/.circleci/config.yml`), `utf-8`)
        .mockResolvedValue(v2FilePlaceHolder);
      const versions = await circleCiResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual({ nodeVersions: new Set([`4`, `6.12`]) });
      expect(fsMock.promises.readFile).toBeCalledTimes(2);
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(normalize(`placeholder/circle.yml`), `utf-8`);
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(normalize(`placeholder/.circleci/config.yml`), `utf-8`);
      expect(parserMock.parse).toBeCalledTimes(2);
      expect(parserMock.parse).toHaveBeenCalledWith(v1Config);
      expect(parserMock.parse).toHaveBeenCalledWith(v2Config);
    });
  });

  describe(`isRelevant`, () => {
    it(`should return true from relevant repo with both config files`, async () => {
      when(fsMock.promises.access)
        .calledWith(normalize(`placeholder/circle.yml`), fileModePlaceholder)
        .mockResolvedValue(undefined)
        .calledWith(normalize(`placeholder/.circleci/config.yml`), fileModePlaceholder)
        .mockResolvedValue(undefined);
      const result = await circleCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
      expect(fsMock.promises.access).toBeCalledTimes(2);
      expect(fsMock.promises.access).toHaveBeenCalledWith(normalize(`placeholder/circle.yml`), fileModePlaceholder);
      expect(fsMock.promises.access).toHaveBeenCalledWith(
        normalize(`placeholder/.circleci/config.yml`),
        fileModePlaceholder
      );
    });

    it(`should return true from relevant repo with v1 config file`, async () => {
      when(fsMock.promises.access)
        .calledWith(normalize(`placeholder/circle.yml`), fileModePlaceholder)
        .mockResolvedValue(undefined)
        .calledWith(normalize(`placeholder/.circleci/config.yml`), fileModePlaceholder)
        .mockRejectedValue(new Error());
      const result = await circleCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
      expect(fsMock.promises.access).toBeCalledTimes(2);
      expect(fsMock.promises.access).toHaveBeenCalledWith(normalize(`placeholder/circle.yml`), fileModePlaceholder);
      expect(fsMock.promises.access).toHaveBeenCalledWith(
        normalize(`placeholder/.circleci/config.yml`),
        fileModePlaceholder
      );
    });

    it(`should return true from relevant repo with v2 config file`, async () => {
      when(fsMock.promises.access)
        .calledWith(normalize(`placeholder/circle.yml`), fileModePlaceholder)
        .mockRejectedValue(new Error())
        .calledWith(normalize(`placeholder/.circleci/config.yml`), fileModePlaceholder)
        .mockResolvedValue(undefined);
      const result = await circleCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
      expect(fsMock.promises.access).toBeCalledTimes(2);
      expect(fsMock.promises.access).toHaveBeenCalledWith(normalize(`placeholder/circle.yml`), fileModePlaceholder);
      expect(fsMock.promises.access).toHaveBeenCalledWith(
        normalize(`placeholder/.circleci/config.yml`),
        fileModePlaceholder
      );
    });

    it(`should return false from non relevant repo`, async () => {
      fsMock.promises.access.mockRejectedValue(new Error());
      const result = await circleCiResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
      expect(fsMock.promises.access).toBeCalledTimes(2);
      expect(fsMock.promises.access).toHaveBeenCalledWith(normalize(`placeholder/circle.yml`), fileModePlaceholder);
      expect(fsMock.promises.access).toHaveBeenCalledWith(
        normalize(`placeholder/.circleci/config.yml`),
        fileModePlaceholder
      );
    });
  });
});
