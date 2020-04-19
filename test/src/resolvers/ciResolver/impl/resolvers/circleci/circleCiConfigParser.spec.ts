/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */
import { loggerFactory } from '../../../../../../common/logger';
import { CircleCiConfigParser } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/circleci/circleCiConfigParser';
import { ITargetMatcher } from '../../../../../../../src/resolvers/ciResolver';
import { mock, mockReset } from 'jest-mock-extended';
import { when } from 'jest-when';
import { NvmHandler } from '../../../../../../../src/resolvers/ciResolver/impl/nvmHandler';

describe(`CircleCi Config Parser`, () => {
  const stablePlaceholder = `__STABLE__`;
  const latestLtsPlaceholder = `__LTS*__`;
  const ltsPlaceholder = `__LTS__`;
  const targetMatcherMock = mock<ITargetMatcher>();
  const nvmHandler = new NvmHandler(targetMatcherMock);
  const circleCiConfigParser = new CircleCiConfigParser(nvmHandler, targetMatcherMock, loggerFactory);

  beforeEach(() => {
    mockReset(targetMatcherMock);
    targetMatcherMock.getStableVersionPlaceholder.mockReturnValue(stablePlaceholder);
    targetMatcherMock.getLatestLtsVersionPlaceholder.mockReturnValue(latestLtsPlaceholder);
    when(targetMatcherMock.getLtsVersionPlaceholder).calledWith({ codename: `dummy` }).mockReturnValue(ltsPlaceholder);
  });

  it(`should resolve node js`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        version: 2.1,
        commands: {
          'test-nodejs': {
            steps: [
              {
                run: {
                  name: `Versions`,
                },
              },
            ],
          },
        },
        jobs: {
          'node-v6': {
            docker: [
              {
                image: `circleci/node:10.16.3`,
              },
              {
                image: `mysql:9`,
              },
            ],
            steps: [`test-nodejs`],
          },
          'node-v8': {
            docker: [
              {
                image: `node:8`,
              },
            ],
            steps: [`test-nodejs`],
          },
        },
        workflows: {
          'node-multi-build': {
            jobs: [`node-v6`, `node-v8`],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`10`, `8`]) });
  });

  it(`should resolve current node`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        jobs: {
          'node-v6': {
            docker: [
              {
                image: `circleci/node:current`,
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([stablePlaceholder]) });
  });

  it(`should resolve latest node`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        jobs: {
          'node-v6': {
            docker: [
              {
                image: `circleci/node:latest`,
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([stablePlaceholder]) });
  });

  it(`should resolve lts node`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        jobs: {
          'node-v6': {
            docker: [
              {
                image: `circleci/node:lts`,
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([latestLtsPlaceholder]) });
  });

  it(`should resolve lts code node`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        jobs: {
          'node-v6': {
            docker: [
              {
                image: `circleci/node:dummy`,
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([ltsPlaceholder]) });
  });

  it(`should not resolve node from faulty nvm command`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        jobs: {
          node: {
            steps: [
              {
                run: `nvm install --dummy`,
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });

  it(`should resolve node from nvm command`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        jobs: {
          node: {
            steps: [
              {
                run: `nvm install 12`,
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`12`]) });
  });

  it(`should resolve node from nvm command with env`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        jobs: {
          environment: {
            NODE: 12,
          },
          node: {
            environment: {
              NODE: 14,
            },
            steps: [
              {
                run: `nvm install $NODE`,
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`12`, `14`]) });
  });

  it(`should resolve node from nvm complex command`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        jobs: {
          node: {
            steps: [
              {
                run: {
                  name: `dummy`,
                  command: `nvm install 12`,
                },
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`12`]) });
  });

  it(`should return empty array when failed to find node js`, async () => {
    const versions = await circleCiConfigParser.parse({
      config: {
        version: 2.1,
        commands: {
          'test-nodejs': {
            steps: [
              {
                run: {
                  name: `Versions`,
                },
              },
            ],
          },
        },
        jobs: {
          'node-v6': {
            image: `node:9`,
            docker: [
              {
                image: `mysql:9`,
              },
            ],
            steps: [`test-nodejs`],
          },
        },
        workflows: {
          'node-multi-build': {
            jobs: [`node-v6`],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });
});
