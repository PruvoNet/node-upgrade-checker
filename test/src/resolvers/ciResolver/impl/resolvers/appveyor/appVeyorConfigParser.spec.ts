/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { loggerFactory } from '../../../../../../common/logger';
import { AppVeyorConfigParser } from '../../../../../../../src/resolvers/ciResolver/impl/resolvers/appveyor/appVeyorConfigParser';
import { mock } from 'jest-mock-extended';
import { NvmHandler } from '../../../../../../../src/resolvers/ciResolver/impl/nvmHandler';
import { ITargetMatcher } from '../../../../../../../src/resolvers/ciResolver';

describe(`AppVeyor Config Parser`, () => {
  const targetMatcherMock = mock<ITargetMatcher>();
  const nvmHandler = new NvmHandler(targetMatcherMock);
  const appVeyorConfigParser = new AppVeyorConfigParser(nvmHandler, loggerFactory);

  it(`should resolve node js from configuration matrix`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        environment: {
          matrix: [
            {
              nodejs_version: 4,
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
    expect(versions).toEqual({ nodeVersions: new Set([`4`, `6.12`]) });
  });

  it(`should return empty array if fails to find env element`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        install: [
          {
            ps: `Install-Product node $env:nodejs_version`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });

  it(`should return empty array if fails to find env variable`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        environment: {
          matrix: [
            {
              foo: 4,
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
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });

  it(`should find version if matrix exists and node js is in env`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        environment: {
          nodejs_version: 4,
          matrix: [
            {
              foo: 4,
            },
          ],
          z: 1,
        },
        install: [
          {
            ps: `Install-Product node $env:nodejs_version`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`4`]) });
  });

  it(`should find version if matrix exists and node js is in global env`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        environment: {
          global: {
            nodejs_version: 4,
          },
          dummy: 1,
          matrix: [
            {
              foo: 4,
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
    expect(versions).toEqual({ nodeVersions: new Set([`4`]) });
  });

  it(`should find version if matrix does not exist and node js is in env`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        environment: {
          nodejs_version: 4,
        },
        install: [
          {
            ps: `Install-Product node $env:nodejs_version`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`4`]) });
  });

  it(`should resolve node js from configuration environment object`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        environment: {
          nodejs_version: `4`,
        },
        install: [
          {
            ps: `Install-Product node $env:nodejs_version`,
          },
          {
            sh: `dummy command`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`4`]) });
  });

  it(`should resolve node js from configuration environment with stack that has no node version in it`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        stack: `mysql`,
        environment: {
          nodejs_version: `6.12`,
        },
        install: [
          {
            ps: `Install-Product node $env:nodejs_version`,
          },
          {
            fds: `dummy command`,
          },
        ],
        z: 1,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`6.12`]) });
  });

  it(`should resolve node js from configuration environment with empty stack`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        stack: null,
        environment: {
          nodejs_version: `6.12`,
        },
        install: [
          {
            ps: `Install-Product node $env:nodejs_version`,
          },
          {
            fds: `dummy command`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`6.12`]) });
  });

  it(`should resolve node js from ps install command`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        install: [
          {
            ps: `Install-Product node 8.12 x64`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`8.12`]) });
  });

  it(`should resolve node js from cmd install command`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        install: [
          {
            cmd: `powershell Install-Product node 8.12 x64`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`8.12`]) });
  });

  it(`should resolve node js from configuration matrix with nvm command`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        environment: {
          matrix: [
            {
              nodejs_version: 4,
            },
            {
              nodejs_version: `6.12`,
            },
          ],
        },
        install: [
          {
            sh: `nvm install $env:nodejs_version`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`4`, `6.12`]) });
  });

  it(`should resolve node js from nvm install command`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        install: [
          {
            sh: `nvm install 8.12`,
            dummy: `nvm install 9.12`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`8.12`]) });
  });

  it(`should not resolve node js from faulty nvm install command`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        install: [
          {
            sh: `nvm install --dummy`,
            dummy: `nvm install 9.12`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set() });
  });

  it(`should resolve node js from nvm install command and stack`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        stack: `node 9`,
        install: [
          {
            sh: `nvm install 8.12`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`9`, `8.12`]) });
  });

  it(`should resolve node js from stack configuration`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        stack: `mysql, node 8.12`,
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([`8.12`]) });
  });

  it(`should return empty array when failed to find install commands`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        stack: 5,
        dummy: `node 9`,
        install: [
          {
            ps: `Install-Product bash`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });

  it(`should return empty array when no install element`, async () => {
    const versions = await appVeyorConfigParser.parse({
      config: {
        init: [
          {
            ps: `Install-Product bash`,
          },
        ],
      },
    });
    expect(versions).toEqual({ nodeVersions: new Set([]) });
  });
});
