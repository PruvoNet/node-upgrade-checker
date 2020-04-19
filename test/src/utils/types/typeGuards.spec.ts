import { isStringOrNumber } from '../../../../src/utils/types/typeGuards';

describe(`type guards`, () => {
  describe(`is string or number`, () => {
    it(`should resolve string`, () => {
      expect(isStringOrNumber(`str`)).toBe(true);
    });

    it(`should resolve number`, () => {
      expect(isStringOrNumber(5)).toBe(true);
    });

    it(`should not resolve undefined`, () => {
      expect(isStringOrNumber(undefined)).toBe(false);
    });

    it(`should not resolve null`, () => {
      expect(isStringOrNumber(null)).toBe(false);
    });

    it(`should not resolve array`, () => {
      expect(isStringOrNumber([])).toBe(false);
    });

    it(`should not resolve object`, () => {
      expect(isStringOrNumber({})).toBe(false);
    });

    it(`should not resolve symbol`, () => {
      expect(isStringOrNumber(Symbol.for(`test`))).toBe(false);
    });
  });
});
