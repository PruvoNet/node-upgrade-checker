import { ChildProcess } from '../../../../../src/container/nodeModulesContainer';
import { Runner } from '../../../../../src/utils/runner/impl/runner';
/* eslint-disable @typescript-eslint/quotes,@typescript-eslint/ban-ts-ignore */
// @ts-ignore
import mockSpawn = require('mock-spawn');
import { ILoggerFactory } from '../../../../../src/utils/logger';
import { ILogger } from '../../../../../src/utils/logger/interfaces/logger';

describe(`runner`, () => {
  let mock = mockSpawn();
  const childProcessSpy = ({
    spawn: mock,
  } as any) as ChildProcess;
  const logErrorMock = jest.fn();
  const logDebugMock = jest.fn();
  const isDebugEnabledMock = jest.fn();
  const isTraceEnabledMock = jest.fn();
  const loggerSpy = ({
    error: logErrorMock,
    debug: logDebugMock,
    isDebugEnabled: isDebugEnabledMock,
    isTraceEnabled: isTraceEnabledMock,
  } as any) as ILogger;
  const getLoggerMock = jest.fn();
  getLoggerMock.mockReturnValue(loggerSpy);
  const loggerFactorySpy: ILoggerFactory = {
    getLogger: getLoggerMock as any,
  };
  const runner = new Runner(childProcessSpy, loggerFactorySpy);

  beforeEach(() => {
    getLoggerMock.mockReset();
    getLoggerMock.mockReturnValue(loggerSpy);
    isDebugEnabledMock.mockReset();
    isTraceEnabledMock.mockReset();
    logErrorMock.mockReset();
    logDebugMock.mockReset();
    mock = mockSpawn();
    childProcessSpy.spawn = mock;
  });

  it(`should resolve on successful run`, async () => {
    isDebugEnabledMock.mockReturnValue(true);
    isTraceEnabledMock.mockReturnValue(true);
    mock.sequence.add(mock.simple(0));
    const execOptionsPlaceHolder = {};
    await runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    expect(mock.calls.length).toBe(1);
    const call = mock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
  });

  it(`should log command output`, async () => {
    isDebugEnabledMock.mockReturnValue(true);
    isTraceEnabledMock.mockReturnValue(true);
    mock.sequence.add(function(this: any, cb: any) {
      this.stdout.write(`output data my library expects`);
      this.stderr.write(`error output data my library expects`);
      setTimeout(() => {
        cb(0);
      }, 10);
    });
    const execOptionsPlaceHolder = {};
    await runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    expect(mock.calls.length).toBe(1);
    const call = mock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
    expect(logErrorMock).toHaveBeenCalledWith(`error output data my library expects`);
    expect(logDebugMock).toHaveBeenCalledWith(`output data my library expects`);
  });

  it(`should not log command output`, async () => {
    isDebugEnabledMock.mockReturnValue(false);
    isTraceEnabledMock.mockReturnValue(false);
    mock.sequence.add(function(this: any, cb: any) {
      this.stdout.write(`output data my library expects`);
      setTimeout(() => {
        cb(0);
      }, 10);
    });
    const execOptionsPlaceHolder = {};
    await runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    expect(mock.calls.length).toBe(1);
    const call = mock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
    expect(logDebugMock).toBeCalledTimes(0);
  });

  it(`should reject on bad exit cose`, async () => {
    isDebugEnabledMock.mockReturnValue(true);
    isTraceEnabledMock.mockReturnValue(true);
    mock.sequence.add(mock.simple(-1));
    const execOptionsPlaceHolder = {};
    const promise = runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: `"npm run build" exited with code: -1`,
    });
    expect(mock.calls.length).toBe(1);
    const call = mock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
  });

  it(`should reject on failed spawn`, async () => {
    isDebugEnabledMock.mockReturnValue(true);
    isTraceEnabledMock.mockReturnValue(true);
    mock.sequence.add(function(this: any, cb: any) {
      this.emit('error', new Error('spawn ENOENT'));
      setTimeout(() => {
        cb(8);
      }, 10);
    });
    const execOptionsPlaceHolder = {};
    const promise = runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: `"npm run build" exited with code: 8`,
    });
    expect(mock.calls.length).toBe(1);
    const call = mock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
    expect(logErrorMock).toHaveBeenCalledWith(`spawn error`, new Error('spawn ENOENT'));
  });
});
