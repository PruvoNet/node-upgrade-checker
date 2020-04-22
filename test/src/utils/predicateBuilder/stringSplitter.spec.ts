import { split } from '../../../../src/utils/predicateBuilder/stringSplitter';

describe(`string splitter`, () => {
  it(`should split undefined`, () => {
    expect(split(undefined)).toEqual([]);
  });

  it(`should split empty string`, () => {
    expect(split(``)).toEqual([]);
  });

  it(`should split long empty string`, () => {
    expect(split(`  `)).toEqual([]);
  });

  it(`should split by space`, () => {
    expect(split(`a "b "  c   d 'f g'  \`',f\``)).toEqual([`a`, `b `, `c`, `d`, `f g`, `',f`]);
  });

  it(`should split by comma`, () => {
    expect(split(`a,b,c, d `)).toEqual([`a`, `b`, `c`, `d`]);
  });

  it(`should not confuse regex`, () => {
    expect(split(`a/s df/g`)).toEqual([`a/s`, `df/g`]);
  });

  it(`should not confuse regex 2`, () => {
    expect(split(`a/sdf/f`)).toEqual([`a/sdf/f`]);
  });

  it(`should parse regex with / in it`, () => {
    expect(split(`/sd\\/f/`)).toEqual([/sd\/f/]);
  });

  it(`should not confuse regex with wrong flags`, () => {
    expect(split(`/s/pm`)).toEqual([`/s/pm`]);
  });

  it(`should handle mixed regex and string`, () => {
    expect(split(`a, /^ab c$/i c /d1/`)).toEqual([`a`, /^ab c$/i, `c`, /d1/]);
  });

  it(`should handle based on regex flags`, () => {
    expect(split(`/a/`)).toEqual([/a/]);
  });

  it(`should handle regex flags 2`, () => {
    expect(split(`/a/i`)).toEqual([/a/i]);
  });

  it(`should handle regex placeholder which is not closing`, () => {
    expect(split(`/i`)).toEqual([`/i`]);
  });

  it(`should handle quotes which are not closing`, () => {
    expect(split(`a b 'c d`)).toEqual([`a`, `b`, `'c`, `d`]);
  });
});
