import { Yarn } from '../../../../../src/utils/yarn/impl/yarn';
import { loggerFactory } from '../../../../common/logger';
import { ICommandRunner } from '../../../../../src/utils/commandRunner';
import { mock, mockReset } from 'jest-mock-extended';

describe(`yarn`, () => {
  const cwd = `my cwd`;
  const runnerMock = mock<ICommandRunner>();
  const yarn = new Yarn(runnerMock, loggerFactory);

  beforeEach(() => {
    mockReset(runnerMock);
  });

  it(`should run yarn install`, async () => {
    runnerMock.executeCommand.mockResolvedValue(undefined);
    await yarn.install({
      cwd,
    });
    expect(runnerMock.executeCommand).toBeCalledTimes(1);
    expect(runnerMock.executeCommand).toHaveBeenCalledWith({
      command: [`yarn`, `install`],
      execOptions: {
        cwd,
      },
    });
  });

  it(`should run yarn build`, async () => {
    runnerMock.executeCommand.mockResolvedValue(undefined);
    await yarn.build({
      cwd,
    });
    expect(runnerMock.executeCommand).toBeCalledTimes(1);
    expect(runnerMock.executeCommand).toHaveBeenCalledWith({
      command: [`yarn`, `run`, `build`],
      execOptions: {
        cwd,
      },
    });
  });

  it(`should run yarn test`, async () => {
    runnerMock.executeCommand.mockResolvedValue(undefined);
    await yarn.test({
      cwd,
    });
    expect(runnerMock.executeCommand).toBeCalledTimes(1);
    expect(runnerMock.executeCommand).toHaveBeenCalledWith({
      command: [`yarn`, `run`, `test`],
      execOptions: {
        cwd,
      },
    });
  });
});
