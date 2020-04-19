/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { FS } from '../../../../../../../src/container/nodeModulesContainer';
import { normalize } from 'path';
import { loggerFactory } from '../../../../../../common/logger';
import { mock, mockReset, mockDeep } from 'jest-mock-extended';
import { GithubActionsResolver } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/githubActions/githubActionsResolver';
import { GithubActionsConfigParser } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/githubActions/githubActionsConfigParser';
import { when } from 'jest-when';
import { Stats } from 'fs';

describe(`Github Actions Resolver`, () => {
  const repoPath = `placeholder`;
  const fileModePlaceholder = 43345;
  const fsMock = mockDeep<FS>({
    constants: {
      R_OK: fileModePlaceholder,
    },
  });
  const statsMock = mock<Stats>();
  const parserMock = mock<GithubActionsConfigParser>();
  const githubActionsResolver = new GithubActionsResolver(fsMock, parserMock, loggerFactory);

  beforeEach(() => {
    mockReset(parserMock);
    mockReset(statsMock);
    mockReset(fsMock);
  });

  it(`should expose the proper name`, async () => {
    expect(githubActionsResolver.resolverName).toBe(`Github Actions`);
  });

  describe(`parse`, () => {
    it(`should parse multiple config files`, async () => {
      const config1FilePlaceHolder = `version: v1`;
      const config2FilePlaceHolder = `version: v2`;
      const config1FileName = `ci1.yml`;
      const config2FileName = `ci2.yml`;
      const config3FileName = `ci3.yml`;
      const config1 = {
        config: {
          version: `v1`,
        },
      };
      const config2 = {
        config: {
          version: `v2`,
        },
      };
      when(parserMock.parse)
        .calledWith(config1)
        .mockResolvedValue({ nodeVersions: new Set([`4`]) })
        .calledWith(config2)
        .mockResolvedValue({ nodeVersions: new Set([`6.12`]) });
      when(fsMock.promises.readdir)
        // @ts-ignore
        .calledWith(normalize(`placeholder/.github/workflows`))
        .mockResolvedValue([config1FileName, config2FileName, config3FileName, `nonYamlFile.sh`]);
      when(fsMock.promises.readFile)
        .calledWith(normalize(`placeholder/.github/workflows/${config1FileName}`), `utf-8`)
        .mockResolvedValue(config1FilePlaceHolder)
        .calledWith(normalize(`placeholder/.github/workflows/${config2FileName}`), `utf-8`)
        .mockResolvedValue(config2FilePlaceHolder)
        .calledWith(normalize(`placeholder/.github/workflows/${config3FileName}`), `utf-8`)
        .mockRejectedValue(new Error(`dummy`));
      const versions = await githubActionsResolver.resolve({
        repoPath,
      });
      expect(versions).toEqual({ nodeVersions: new Set([`4`, `6.12`]) });
      expect(fsMock.promises.readdir).toBeCalledTimes(1);
      expect(fsMock.promises.readdir).toHaveBeenCalledWith(normalize(`placeholder/.github/workflows`));
      expect(fsMock.promises.readFile).toBeCalledTimes(3);
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(
        normalize(`placeholder/.github/workflows/${config1FileName}`),
        `utf-8`
      );
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(
        normalize(`placeholder/.github/workflows/${config2FileName}`),
        `utf-8`
      );
      expect(fsMock.promises.readFile).toHaveBeenCalledWith(
        normalize(`placeholder/.github/workflows/${config3FileName}`),
        `utf-8`
      );
      expect(parserMock.parse).toBeCalledTimes(2);
      expect(parserMock.parse).toHaveBeenCalledWith(config1);
      expect(parserMock.parse).toHaveBeenCalledWith(config2);
    });
  });

  describe(`isRelevant`, () => {
    it(`should return true from relevant repo`, async () => {
      when(fsMock.promises.access)
        .calledWith(normalize(`placeholder/.github/workflows`), fileModePlaceholder)
        .mockResolvedValue(undefined);
      when(fsMock.promises.stat).calledWith(normalize(`placeholder/.github/workflows`)).mockResolvedValue(statsMock);
      when(statsMock.isDirectory).calledWith().mockReturnValue(true);
      const result = await githubActionsResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(true);
      expect(fsMock.promises.access).toBeCalledTimes(1);
      expect(fsMock.promises.access).toHaveBeenCalledWith(
        normalize(`placeholder/.github/workflows`),
        fileModePlaceholder
      );
      expect(fsMock.promises.stat).toBeCalledTimes(1);
      expect(fsMock.promises.stat).toHaveBeenCalledWith(normalize(`placeholder/.github/workflows`));
      expect(statsMock.isDirectory).toBeCalledTimes(1);
    });

    it(`should return false from non relevant repo - workflows directory does not exist`, async () => {
      when(fsMock.promises.access)
        .calledWith(normalize(`placeholder/.github/workflows`), fileModePlaceholder)
        .mockRejectedValue(new Error(`dummy`));
      const result = await githubActionsResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
      expect(fsMock.promises.access).toBeCalledTimes(1);
      expect(fsMock.promises.access).toHaveBeenCalledWith(
        normalize(`placeholder/.github/workflows`),
        fileModePlaceholder
      );
      expect(fsMock.promises.stat).toBeCalledTimes(0);
      expect(statsMock.isDirectory).toBeCalledTimes(0);
    });

    it(`should return false from non relevant repo - failed to stats directory`, async () => {
      when(fsMock.promises.access)
        .calledWith(normalize(`placeholder/.github/workflows`), fileModePlaceholder)
        .mockResolvedValue(undefined);
      when(fsMock.promises.stat)
        .calledWith(normalize(`placeholder/.github/workflows`))
        .mockRejectedValue(new Error(`dummy`));
      const result = await githubActionsResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
      expect(fsMock.promises.access).toBeCalledTimes(1);
      expect(fsMock.promises.access).toHaveBeenCalledWith(
        normalize(`placeholder/.github/workflows`),
        fileModePlaceholder
      );
      expect(fsMock.promises.stat).toBeCalledTimes(1);
      expect(fsMock.promises.stat).toHaveBeenCalledWith(normalize(`placeholder/.github/workflows`));
      expect(statsMock.isDirectory).toBeCalledTimes(0);
    });

    it(`should return false from non relevant repo - workflows is not a directory`, async () => {
      when(fsMock.promises.access)
        .calledWith(normalize(`placeholder/.github/workflows`), fileModePlaceholder)
        .mockResolvedValue(undefined);
      when(fsMock.promises.stat).calledWith(normalize(`placeholder/.github/workflows`)).mockResolvedValue(statsMock);
      when(statsMock.isDirectory).calledWith().mockReturnValue(false);
      const result = await githubActionsResolver.isRelevant({
        repoPath,
      });
      expect(result).toBe(false);
      expect(fsMock.promises.access).toBeCalledTimes(1);
      expect(fsMock.promises.access).toHaveBeenCalledWith(
        normalize(`placeholder/.github/workflows`),
        fileModePlaceholder
      );
      expect(fsMock.promises.stat).toBeCalledTimes(1);
      expect(fsMock.promises.stat).toHaveBeenCalledWith(normalize(`placeholder/.github/workflows`));
      expect(statsMock.isDirectory).toBeCalledTimes(1);
    });
  });
});
