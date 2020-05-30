/* eslint-disable @typescript-eslint/naming-convention */
import { NvmHandler } from '../../../../../src/resolvers/ciResolver/impl/nvmHandler';
import { mock, mockClear } from 'jest-mock-extended';
import { ITargetMatcher } from '../../../../../src/resolvers/ciResolver';
import { when } from 'jest-when';

describe(`nvm handler`, () => {
  const stablePlaceholder = `__STABLE__`;
  const latestLtsPlaceholder = `__LTS*__`;
  const ltsPlaceholder = `__LTS__`;
  const ltsVersion = `dummy`;
  const targetMatcherMock = mock<ITargetMatcher>();
  targetMatcherMock.getStableVersionPlaceholder.mockReturnValue(stablePlaceholder);
  targetMatcherMock.getLatestLtsVersionPlaceholder.mockReturnValue(latestLtsPlaceholder);
  when(targetMatcherMock.getLtsVersionPlaceholder).calledWith({ codename: ltsVersion }).mockReturnValue(ltsPlaceholder);
  const nvmHandler = new NvmHandler(targetMatcherMock);
  beforeEach(() => {
    mockClear(targetMatcherMock);
  });

  describe(`is nvm command`, () => {
    it(`should realize nvm command`, () => {
      expect(nvmHandler.isNvmCommand(`nvm install v12`)).toBe(true);
    });

    it(`should realize nvm command with env variable`, () => {
      expect(nvmHandler.isNvmCommand(`nvm install $NODE`)).toBe(true);
    });

    it(`should realize nvm command in complex shell`, () => {
      expect(
        nvmHandler.isNvmCommand(
          `if [ -n "\${NODE-}" ]; then . nvm.sh && set -ex && nvm install --latest-npm "\${NODE}" && npm --version; fi`
        )
      ).toBe(true);
    });

    it(`should not realize nvm command when missing node version`, () => {
      expect(nvmHandler.isNvmCommand(`nvm install`)).toBe(false);
    });

    it(`should not realize nvm sub command is wrong`, () => {
      expect(nvmHandler.isNvmCommand(`nvm ls`)).toBe(false);
    });

    it(`should return false if not nvm command`, () => {
      expect(nvmHandler.isNvmCommand(`bla install`)).toBe(false);
    });
  });

  describe(`get nvm version`, () => {
    describe(`bad nvm command`, () => {
      it(`should return nothing if not nvm command`, () => {
        expect(nvmHandler.getNvmVersion(`bla install`, {})).toBe(undefined);
      });

      it(`should return nothing if not complete nvm command`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install`, {})).toBe(undefined);
      });

      it(`should fail if no matching env variable`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install $nodejs_version`, {})).toBe(undefined);
      });
    });

    describe(`with env`, () => {
      it(`should return node version with env variable 1`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install "\${NODE}"`, { NODE: `12` })).toBe(`12`);
      });

      it(`should return node version with env variable 2`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install \${NODE}`, { NODE: `12` })).toBe(`12`);
      });

      it(`should return node version with env variable 3`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install \$NODE`, { NODE: `12` })).toBe(`12`);
      });

      it(`should return param specific lts node version using env`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install --lts=$NODE`, { NODE: `dummy` })).toBe(ltsPlaceholder);
      });

      it(`should return specific lts node version using env`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install lts/$NODE`, { NODE: `dummy` })).toBe(ltsPlaceholder);
      });
    });

    describe(`no env`, () => {
      it(`should return node version with complex shell command`, () => {
        expect(
          nvmHandler.getNvmVersion(
            `if [ -n "\${NODE-}" ]; then . nvm.sh && set -ex && nvm install --latest-npm "12" && npm --version; fi`,
            {}
          )
        ).toBe(`12`);
      });

      it(`should return node version with complex shell command 2`, () => {
        expect(
          nvmHandler.getNvmVersion(
            `if [ -n "\${NODE-}" ]; then . nvm.sh && set -ex && nvm install --latest-npm "12" || npm --version; fi`,
            {}
          )
        ).toBe(`12`);
      });

      it(`should return node version with complex shell command 3`, () => {
        expect(
          nvmHandler.getNvmVersion(
            `if [ -n "\${NODE-}" ]; then . nvm.sh && set -ex && nvm install --latest-npm "12" ; npm --version; fi`,
            {}
          )
        ).toBe(`12`);
      });

      it(`should return node version with multiple nvm commands`, () => {
        expect(nvmHandler.getNvmVersion(`nvm ls && nvm install --latest-npm "12"`, {})).toBe(`12`);
      });

      it(`should return node version with multi line nvm command`, () => {
        expect(
          nvmHandler.getNvmVersion(
            `echo "test"
         nvm install --latest-npm "12"
         echo "test2"`,
            {}
          )
        ).toBe(`12`);
      });

      it(`should return node version with latest npm`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install --latest-npm 12`, {})).toBe(`12`);
      });

      it(`should return plain node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install 12`, {})).toBe(`12`);
      });

      it(`should return full node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install 12.0.1`, {})).toBe(`12.0.1`);
      });

      it(`should return v prefixed node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install v12`, {})).toBe(`v12`);
      });

      it(`should return stable node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install node`, {})).toBe(stablePlaceholder);
      });

      it(`should return raw lts node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install --lts`, {})).toBe(latestLtsPlaceholder);
      });

      it(`should return param specific lts node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install --lts=dummy`, {})).toBe(ltsPlaceholder);
      });

      it(`should return param 2 specific lts node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install --lts dummy`, {})).toBe(ltsPlaceholder);
      });

      it(`should return latest lts node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install 'lts/*'`, {})).toBe(latestLtsPlaceholder);
      });

      it(`should return latest lts node version - single quote`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install 'lts/*'`, {})).toBe(latestLtsPlaceholder);
      });

      it(`should return latest lts node version - double quote`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install "lts/*"`, {})).toBe(latestLtsPlaceholder);
      });

      it(`should return specific lts node version`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install lts/dummy`, {})).toBe(ltsPlaceholder);
      });

      it(`should return specific lts node version - single quot`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install 'lts/dummy'`, {})).toBe(ltsPlaceholder);
      });

      it(`should return specific lts node version - double quot`, () => {
        expect(nvmHandler.getNvmVersion(`nvm install "lts/dummy"`, {})).toBe(ltsPlaceholder);
      });
    });
  });

  describe(`get nvm versions`, () => {
    it(`should return node versions with multiple environments`, () => {
      expect(nvmHandler.getNvmVersions(`nvm install "\${NODE}"`, [{ NODE: `12` }, { NODE: `13` }])).toEqual(
        new Set([`12`, `13`])
      );
    });
    it(`should return node versions with no environments`, () => {
      expect(nvmHandler.getNvmVersions(`nvm install 12`, [])).toEqual(new Set([`12`]));
    });
  });

  describe(`get nvm versions from matrix`, () => {
    it(`should return node versions with env matrix`, () => {
      expect(
        nvmHandler.getNvmVersionsFromMatrix(`nvm install "\${NODE}"`, { NODE: [`12`, `13`], BLA: [`1`, `2`, `3`] })
      ).toEqual(new Set([`12`, `13`]));
    });
  });
});
