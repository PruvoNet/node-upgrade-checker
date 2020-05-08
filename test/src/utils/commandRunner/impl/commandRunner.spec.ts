import { CommandRunner } from '../../../../../src/utils/commandRunner/impl/commandRunner';
// @ts-ignore
import mockSpawn = require('mock-spawn');
import { ILoggerFactory, ILogger } from '../../../../../src/utils/logger';
import { mock, mockReset } from 'jest-mock-extended';
import { Spawn } from '../../../../../src/container/nodeModulesContainer';

describe(`command runner`, () => {
  let spawnMock = mockSpawn();
  const childProcessMock: any = ({
    spawn: spawnMock,
  } as any) as Spawn;
  const loggerMock = mock<ILogger>();
  const loggerFactoryMock = mock<ILoggerFactory>();
  loggerFactoryMock.getLogger.mockReturnValue(loggerMock);
  const runner = new CommandRunner(childProcessMock, loggerFactoryMock);

  beforeEach(() => {
    mockReset(loggerMock);
    spawnMock = mockSpawn();
    childProcessMock.spawn = spawnMock;
  });

  it(`should resolve on successful run`, async () => {
    spawnMock.sequence.add(spawnMock.simple(0));
    const execOptionsPlaceHolder = {};
    await runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    expect(spawnMock.calls.length).toBe(1);
    const call = spawnMock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
  });

  it(`should log command output`, async () => {
    spawnMock.sequence.add(function (this: any, cb: any) {
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
    expect(spawnMock.calls.length).toBe(1);
    const call = spawnMock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
    expect(loggerMock.error).toHaveBeenCalledWith(`Command error output:\n`, `error output data my library expects`);
    expect(loggerMock.debug).toHaveBeenCalledWith(`Command output:\n`, `output data my library expects`);
  });

  it(`should log error command output`, async () => {
    spawnMock.sequence.add(function (this: any, cb: any) {
      this.stdout.write(`output data my library expects`);
      this.stderr.write(`error output data my library expects`);
      setTimeout(() => {
        cb(1);
      }, 10);
    });
    const execOptionsPlaceHolder = {};
    const promise = runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: `"npm run build" exited with code: 1`,
    });
    expect(spawnMock.calls.length).toBe(1);
    const call = spawnMock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
    expect(loggerMock.error).toHaveBeenCalledWith(`Command error output:\n`, `error output data my library expects`);
  });

  it(`should not log error command output if empty output`, async () => {
    spawnMock.sequence.add(function (this: any, cb: any) {
      this.stdout.write(`output data my library expects`);
      setTimeout(() => {
        cb(1);
      }, 10);
    });
    const execOptionsPlaceHolder = {};
    const promise = runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: `"npm run build" exited with code: 1`,
    });
    expect(spawnMock.calls.length).toBe(1);
    const call = spawnMock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
    expect(loggerMock.error).toBeCalledTimes(0);
  });

  it(`should reject on bad exit code`, async () => {
    spawnMock.sequence.add(spawnMock.simple(-1));
    const execOptionsPlaceHolder = {};
    const promise = runner.executeCommand({
      execOptions: execOptionsPlaceHolder,
      command: [`npm`, `run`, `build`],
    });
    await expect(promise).rejects.toBeInstanceOf(Error);
    await expect(promise).rejects.toMatchObject({
      message: `"npm run build" exited with code: -1`,
    });
    expect(spawnMock.calls.length).toBe(1);
    const call = spawnMock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
  });

  it(`should reject on failed spawn`, async () => {
    spawnMock.sequence.add(function (this: any, cb: any) {
      this.emit(`error`, new Error(`spawn ENOENT`));
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
    expect(spawnMock.calls.length).toBe(1);
    const call = spawnMock.calls[0];
    expect(call.command).toBe(`npm`);
    expect(call.args).toEqual([`run`, `build`]);
    expect(call.opts).toBe(execOptionsPlaceHolder);
    expect(loggerMock.error).toHaveBeenCalledWith(`spawn error`, new Error(`spawn ENOENT`));
    expect(loggerMock.debug).not.toHaveBeenCalledWith(`Command error output:\n`, ``);
  });
});
