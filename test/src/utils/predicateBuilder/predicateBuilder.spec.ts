import { buildPredicate } from '../../../../src/utils/predicateBuilder/predicateBuilder';

describe(`predicate builder`, () => {
  it(`should return truthy predicate from empty include and exclude filters`, () => {
    const predicate = buildPredicate([], []);
    expect(predicate(`dummy`)).toBe(true);
  });

  it(`should return falsy predicate if include equals exclude`, () => {
    const predicate = buildPredicate([`a`], [`a`]);
    expect(predicate(`a`)).toBe(false);
    expect(predicate(`b`)).toBe(false);
  });

  it(`should handle mixed regex and string`, () => {
    const predicate = buildPredicate([`a`, /^ab c$/i, `c`, /d1/], []);
    expect(predicate(`a`)).toBe(true);
    expect(predicate(`c`)).toBe(true);
    expect(predicate(`gd1 5`)).toBe(true);
    expect(predicate(`ab c`)).toBe(true);
    expect(predicate(`ab cd`)).toBe(false);
  });

  it(`should predicate based on include only`, () => {
    const predicate = buildPredicate([`a`, `b`, `c`, `d`], []);
    expect(predicate(`a`)).toBe(true);
    expect(predicate(`b`)).toBe(true);
    expect(predicate(`c`)).toBe(true);
    expect(predicate(`d`)).toBe(true);
    expect(predicate(`dummy`)).toBe(false);
    expect(predicate(`ab`)).toBe(false);
  });

  it(`should predicate based on exclude only`, () => {
    const predicate = buildPredicate([], [`a`, `b`, `c`, `d`]);
    expect(predicate(`a`)).toBe(false);
    expect(predicate(`b`)).toBe(false);
    expect(predicate(`c`)).toBe(false);
    expect(predicate(`d`)).toBe(false);
    expect(predicate(`dummy`)).toBe(true);
    expect(predicate(`ab`)).toBe(true);
  });

  it(`should predicate based on include and exclude`, () => {
    const predicate = buildPredicate([`a`, `b`], [`c`, `d`]);
    expect(predicate(`a`)).toBe(true);
    expect(predicate(`b`)).toBe(true);
    expect(predicate(`c`)).toBe(false);
    expect(predicate(`d`)).toBe(false);
    expect(predicate(`dummy`)).toBe(false);
    expect(predicate(`ab`)).toBe(false);
  });

  it(`should predicate based on include and exclude intersection`, () => {
    const predicate = buildPredicate([/a/], [`a`]);
    expect(predicate(`a`)).toBe(false);
    expect(predicate(`ab`)).toBe(true);
    expect(predicate(`c`)).toBe(false);
  });

  it(`should predicate based on include and exclude intersection 2`, () => {
    const predicate = buildPredicate([`a`], [/a/]);
    expect(predicate(`a`)).toBe(false);
    expect(predicate(`ab`)).toBe(false);
    expect(predicate(`c`)).toBe(false);
  });
});
