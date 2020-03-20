import { EnginesResolver } from '../../../../../src/resolvers/enginesResolver/impl/enginesResolver';

describe(`engines resolver`, () => {
  const enginesResolver = new EnginesResolver();

  it(`should throw if invalid target`, async () => {
    const promise = enginesResolver.resolve({
      engines: `>=8`,
      targetNode: `foo`,
    });
    await expect(promise).rejects.toBeInstanceOf(TypeError);
    await expect(promise).rejects.toMatchObject({
      message: expect.stringContaining(`Node target version foo is not valid`),
    });
  });

  it(`should throw if invalid engines`, async () => {
    const promise = enginesResolver.resolve({
      engines: `foo`,
      targetNode: `8`,
    });
    await expect(promise).rejects.toBeInstanceOf(TypeError);
    await expect(promise).rejects.toMatchObject({
      message: expect.stringContaining(`Engines range foo is not valid`),
    });
  });

  it(`should not match if no engines`, async () => {
    const result = await enginesResolver.resolve({
      engines: undefined,
      targetNode: `foo`,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should not match if not in range`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=6 <=12`,
      targetNode: `4`,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should not match if range is not complete`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=1 <=4 || >=6`,
      targetNode: `8`,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should match if some of the range is incomplete`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=1 <=4 || >=6`,
      targetNode: `3`,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if in range`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=6 <=12`,
      targetNode: `8`,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if in range 2`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>6 <=12`,
      targetNode: `8`,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should match if in range equality`, async () => {
    const result = await enginesResolver.resolve({
      engines: `=8`,
      targetNode: `8`,
    });
    expect(result.isMatch).toBe(true);
  });

  it(`should not match if in range strict equality`, async () => {
    const result = await enginesResolver.resolve({
      engines: `=8.0.1`,
      targetNode: `8`,
    });
    expect(result.isMatch).toBe(false);
  });

  it(`should match if in range hyphen`, async () => {
    const result = await enginesResolver.resolve({
      engines: `6 - 12`,
      targetNode: `8`,
    });
    expect(result.isMatch).toBe(true);
  });
});
