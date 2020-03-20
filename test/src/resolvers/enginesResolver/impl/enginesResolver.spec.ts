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

  it(`should match if in range`, async () => {
    const result = await enginesResolver.resolve({
      engines: `>=6 <=12`,
      targetNode: `8`,
    });
    expect(result.isMatch).toBe(true);
  });
});
