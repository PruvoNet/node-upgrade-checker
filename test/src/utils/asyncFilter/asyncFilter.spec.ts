'use strict';

import { asyncFilter } from '../../../../src/utils/asyncFilter/asyncFilter';

const isEven = async (n: number): Promise<boolean> => {
  return n % 2 === 0;
};

describe(`async filter`, () => {
  it(`should filter async`, async () => {
    const results = await asyncFilter([1, 2, 3, 4, 5], isEven);
    expect(results).toEqual([2, 4]);
  });
});
