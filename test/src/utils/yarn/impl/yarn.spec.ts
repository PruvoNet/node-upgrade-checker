import { Yarn } from '../../../../../src/utils/yarn/impl/yarn';
import { loggerFactory } from '../../../../common/logger';
import { IRunner } from '../../../../../src/utils/runner';

describe(`yarn`, () => {
  const cwd = `my cwd`;
  const executeCommandMock = jest.fn();
  const runnerSpy: IRunner = {
    executeCommand: executeCommandMock,
  };
  const yarn = new Yarn(runnerSpy, loggerFactory);

  beforeEach(() => {
    executeCommandMock.mockReset();
  });

  it(`should run yarn install`, async () => {
    executeCommandMock.mockResolvedValue(undefined);
    await yarn.install({
      cwd,
    });
    expect(executeCommandMock).toBeCalledTimes(1);
    expect(executeCommandMock).toHaveBeenCalledWith({
      command: [`yarn`, `install`],
      execOptions: {
        cwd,
      },
    });
  });

  it(`should run yarn build`, async () => {
    executeCommandMock.mockResolvedValue(undefined);
    await yarn.build({
      cwd,
    });
    expect(executeCommandMock).toBeCalledTimes(1);
    expect(executeCommandMock).toHaveBeenCalledWith({
      command: [`yarn`, `run`, `build`],
      execOptions: {
        cwd,
      },
    });
  });

  it(`should run yarn test`, async () => {
    executeCommandMock.mockResolvedValue(undefined);
    await yarn.test({
      cwd,
    });
    expect(executeCommandMock).toBeCalledTimes(1);
    expect(executeCommandMock).toHaveBeenCalledWith({
      command: [`yarn`, `run`, `test`],
      execOptions: {
        cwd,
      },
    });
  });
});
