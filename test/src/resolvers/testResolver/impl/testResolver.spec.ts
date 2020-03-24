import { TestResolver } from '../../../../../src/resolvers/testResolver/impl/testResolver';
import { loggerFactory } from '../../../../common/logger';
import { IYarn, IYarnOptions } from '../../../../../src/utils/yarn';
import { ITestResolverOptions } from '../../../../../src/resolvers/testResolver';
import { mock, mockReset } from 'jest-mock-extended';

describe(`test resolver`, () => {
  const repoPath = `my-test-path`;
  const resolverName = `yarn run test`;
  const resolveOptions: ITestResolverOptions = {
    repoPath,
  };
  const yarnOptions: IYarnOptions = {
    cwd: repoPath,
  };
  const yarnMock = mock<IYarn>();
  const testResolver = new TestResolver(yarnMock, loggerFactory);

  beforeEach(() => {
    mockReset(yarnMock);
  });

  it(`should run yarn flow correctly`, async () => {
    yarnMock.install.mockResolvedValue(undefined);
    yarnMock.build.mockResolvedValue(undefined);
    yarnMock.test.mockResolvedValue(undefined);
    const result = await testResolver.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: true,
      resolverName,
    });
    expect(yarnMock.install).toHaveBeenCalledTimes(1);
    expect(yarnMock.install).toHaveBeenCalledWith(yarnOptions);
    expect(yarnMock.build).toHaveBeenCalledTimes(1);
    expect(yarnMock.build).toHaveBeenCalledWith(yarnOptions);
    expect(yarnMock.test).toHaveBeenCalledTimes(1);
    expect(yarnMock.test).toHaveBeenCalledWith(yarnOptions);
  });

  it(`should fail if yarn install failed`, async () => {
    yarnMock.install.mockRejectedValue(new Error(`dummy error`));
    yarnMock.build.mockResolvedValue(undefined);
    yarnMock.test.mockResolvedValue(undefined);
    const result = await testResolver.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: false,
    });
    expect(yarnMock.install).toHaveBeenCalledTimes(1);
    expect(yarnMock.install).toHaveBeenCalledWith(yarnOptions);
    expect(yarnMock.build).toHaveBeenCalledTimes(0);
    expect(yarnMock.test).toHaveBeenCalledTimes(0);
  });

  it(`should fail if yarn build failed`, async () => {
    yarnMock.build.mockRejectedValue(new Error(`dummy error`));
    yarnMock.install.mockResolvedValue(undefined);
    yarnMock.test.mockResolvedValue(undefined);
    const result = await testResolver.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: false,
    });
    expect(yarnMock.install).toHaveBeenCalledTimes(1);
    expect(yarnMock.install).toHaveBeenCalledWith(yarnOptions);
    expect(yarnMock.build).toHaveBeenCalledTimes(1);
    expect(yarnMock.build).toHaveBeenCalledWith(yarnOptions);
    expect(yarnMock.test).toHaveBeenCalledTimes(0);
  });

  it(`should fail if yarn test failed`, async () => {
    yarnMock.test.mockRejectedValue(new Error(`dummy error`));
    yarnMock.install.mockResolvedValue(undefined);
    yarnMock.build.mockResolvedValue(undefined);
    const result = await testResolver.resolve(resolveOptions);
    expect(result).toEqual({
      isMatch: false,
    });
    expect(yarnMock.install).toHaveBeenCalledTimes(1);
    expect(yarnMock.install).toHaveBeenCalledWith(yarnOptions);
    expect(yarnMock.build).toHaveBeenCalledTimes(1);
    expect(yarnMock.build).toHaveBeenCalledWith(yarnOptions);
    expect(yarnMock.test).toHaveBeenCalledTimes(1);
    expect(yarnMock.test).toHaveBeenCalledWith(yarnOptions);
  });
});
