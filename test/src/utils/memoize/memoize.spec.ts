import { memoize } from '../../../../src/utils/memoize/memoize';

interface IData {
  method0: string;
  method1: string;
  method2: string;
}

describe(`memoize`, () => {
  const sharedHasher = jest.fn((...args: any[]) => args.join(`:`));

  class Dummy {
    public method0Mock = jest.fn(() => {
      return this.data.method0;
    });
    public method1Mock = jest.fn((...args: any[]) => {
      return [this.data.method1, ...args].join(`:`);
    });
    public method2Mock = jest.fn((...args: any[]) => {
      return [this.data.method2, ...args].join(`:`);
    });

    constructor(public data: IData) {}

    @memoize()
    public method0(): string {
      return this.method0Mock();
    }

    @memoize()
    public method1(...args: any[]): string {
      return this.method1Mock(...args);
    }

    @memoize(sharedHasher)
    public method2(...args: any[]): string {
      return this.method2Mock(...args);
    }
  }

  let subjectA!: Dummy;
  let subjectB!: Dummy;

  beforeEach(() => {
    subjectA = new Dummy({
      method0: `method0 A`,
      method1: `method1 A`,
      method2: `method2 A`,
    });
    subjectB = new Dummy({
      method0: `method0 B`,
      method1: `method1 B`,
      method2: `method2 B`,
    });
  });

  it(`should remember method values with no args`, () => {
    expect(subjectA.method0()).toBe(`method0 A`);
    expect(subjectA.method0Mock).toHaveBeenCalledTimes(1);
    expect(subjectB.method0Mock).toHaveBeenCalledTimes(0);
    expect(subjectB.method0()).toBe(`method0 B`);
    expect(subjectA.method0Mock).toHaveBeenCalledTimes(1);
    expect(subjectB.method0Mock).toHaveBeenCalledTimes(1);
    expect(subjectA.method0()).toBe(`method0 A`);
    expect(subjectB.method0()).toBe(`method0 B`);
    expect(subjectA.method0Mock).toHaveBeenCalledTimes(1);
    expect(subjectB.method0Mock).toHaveBeenCalledTimes(1);
  });

  it(`should remember method values with one args`, () => {
    expect(subjectA.method1(`foo`)).toBe(`method1 A:foo`);
    expect(subjectA.method1Mock).toHaveBeenCalledTimes(1);
    expect(subjectA.method1(`bar`)).toBe(`method1 A:bar`);
    expect(subjectA.method1Mock).toHaveBeenCalledTimes(2);
    expect(subjectA.method1(`foo`)).toBe(`method1 A:foo`);
    expect(subjectA.method1(`bar`)).toBe(`method1 A:bar`);
    expect(subjectA.method1Mock).toHaveBeenCalledTimes(2);
  });
});
