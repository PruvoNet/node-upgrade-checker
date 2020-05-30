/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { loggerFactory } from '../../../../../../common/logger';
import { ITargetMatcher } from '../../../../../../../src/resolvers/ciResolver';
import { mock, mockReset } from 'jest-mock-extended';
import { when } from 'jest-when';
import { NvmHandler } from '../../../../../../../src/resolvers/ciResolver/impl/nvmHandler';
import { GithubActionsConfigParser } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/githubActions/githubActionsConfigParser';

describe(`Github Actions Config Parser`, () => {
  const stablePlaceholder = `__STABLE__`;
  const latestLtsPlaceholder = `__LTS*__`;
  const ltsPlaceholder = `__LTS__`;
  const targetMatcherMock = mock<ITargetMatcher>();
  const nvmHandler = new NvmHandler(targetMatcherMock);
  const githubActionsConfigParser = new GithubActionsConfigParser(nvmHandler, loggerFactory);

  beforeEach(() => {
    mockReset(targetMatcherMock);
    targetMatcherMock.getStableVersionPlaceholder.mockReturnValue(stablePlaceholder);
    targetMatcherMock.getLatestLtsVersionPlaceholder.mockReturnValue(latestLtsPlaceholder);
    when(targetMatcherMock.getLtsVersionPlaceholder).calledWith({ codename: `dummy` }).mockReturnValue(ltsPlaceholder);
  });

  it(`should resolve node from setup node step`, async () => {
    const versions = await githubActionsConfigParser.parse({
      config: {
        jobs: {
          build: {
            steps: [
              {
                uses: `actions/setup-node@v1`,
                with: {
                  'node-version': `12.x`,
                },
              },
            ],
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`12.x`]) });
  });

  it(`should resolve node from setup node step with matrix`, async () => {
    const versions = await githubActionsConfigParser.parse({
      config: {
        strategy: {
          matrix: {
            'node-version': [6, `10.x`, `4.x`],
          },
        },
        steps: [
          {
            uses: `actions/setup-node@v1`,
            with: {
              'node-version': `\${{ matrix.node-version }}`,
            },
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`4.x`, `6`, `10.x`]) });
  });

  it(`should fail to resolve node from setup node step with no matching env variable`, async () => {
    const versions = await githubActionsConfigParser.parse({
      config: {
        strategy: {
          matrix: {
            'node-version': [6, `10.x`, `4.x`],
          },
        },
        steps: [
          {
            uses: `actions/setup-node@v1`,
            with: {
              'node-version': `\${{ matrix.node }}`,
            },
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set() });
  });

  it(`should resolve node from nvm command`, async () => {
    const versions = await githubActionsConfigParser.parse({
      config: {
        steps: [
          {
            run: `nvm install 12`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`12`]) });
  });

  it(`should resolve node from nvm command with env`, async () => {
    const versions = await githubActionsConfigParser.parse({
      config: {
        steps: [
          {
            run: `nvm install $NODE`,
            env: {
              NODE: 12,
            },
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`12`]) });
  });

  it(`should resolve node from nvm command with env 2`, async () => {
    const versions = await githubActionsConfigParser.parse({
      config: {
        steps: [
          {
            run: `nvm install \${{ matrix.node }}`,
            env: {
              node: 12,
            },
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`12`]) });
  });

  it(`should resolve node from nvm command with env and matrix`, async () => {
    const versions = await githubActionsConfigParser.parse({
      config: {
        strategy: {
          matrix: {
            b: 4,
            NODE: [6],
            include: [
              {
                NODE: `10`,
                DUMMY: `2`,
              },
            ],
            Z: 4,
          },
        },
        jobs: {
          test: {
            steps: [
              {
                run: `nvm install $NODE`,
                env: {
                  NODE: 12,
                },
              },
              {
                run: `echo $NODE`,
                env: {
                  NODE: 14,
                },
              },
            ],
            strategy: {
              matrix: {
                NODE: [8],
              },
            },
          },
        },
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`12`, `6`, `8`, `10`, `14`]) });
  });
});
