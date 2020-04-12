import { memoize } from '../../../../src/utils/memoize/memoize';

interface IData {
  method0: string;
  method1: string;
  method2: string;
}

describe(`memoize`, () => {
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

    @memoize((arg: string) => arg)
    public method1(arg: string): string {
      return this.method1Mock(arg);
    }

    @memoize((arg?: string) => arg || ``)
    public method2(arg?: string): string {
      return this.method2Mock(arg);
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

  it(`should remember method values with one arg`, () => {
    expect(subjectA.method1(`foo`)).toBe(`method1 A:foo`);
    expect(subjectA.method1Mock).toHaveBeenCalledTimes(1);
    expect(subjectA.method1(`bar`)).toBe(`method1 A:bar`);
    expect(subjectA.method1Mock).toHaveBeenCalledTimes(2);
    expect(subjectA.method1(`foo`)).toBe(`method1 A:foo`);
    expect(subjectA.method1(`bar`)).toBe(`method1 A:bar`);
    expect(subjectA.method1Mock).toHaveBeenCalledTimes(2);
  });

  it(`should remember method values with optional one arg`, () => {
    expect(subjectA.method2(`foo`)).toBe(`method2 A:foo`);
    expect(subjectA.method2Mock).toHaveBeenCalledTimes(1);
    expect(subjectA.method2(`bar`)).toBe(`method2 A:bar`);
    expect(subjectA.method2Mock).toHaveBeenCalledTimes(2);
    expect(subjectA.method2(`foo`)).toBe(`method2 A:foo`);
    expect(subjectA.method2(`bar`)).toBe(`method2 A:bar`);
    expect(subjectA.method2Mock).toHaveBeenCalledTimes(2);
    expect(subjectA.method2()).toBe(`method2 A:`);
    expect(subjectA.method2Mock).toHaveBeenCalledTimes(3);
    expect(subjectA.method2()).toBe(`method2 A:`);
    expect(subjectA.method2Mock).toHaveBeenCalledTimes(3);
  });
});
