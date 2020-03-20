import { ChildProcess } from '../../../../../src/container/nodeModulesContainer';
import { Runner } from '../../../../../src/utils/runner/impl/runner';
/* eslint-disable @typescript-eslint/quotes,@typescript-eslint/ban-ts-ignore */
// @ts-ignore
import mockSpawn = require('mock-spawn');
import { LoggerFactory } from '../../../../../src/utils/logger/impl/loggerFactory';

describe(`runner`, () => {
  let mock = mockSpawn();
  const childProcessSpy = ({
    spawn: mock,
  } as any) as ChildProcess;
  const runner = new Runner(childProcessSpy, new LoggerFactory());

  beforeEach(() => {
    mock = mockSpawn();
    childProcessSpy.spawn = mock;
  });

  it(`should resolve on successful run `, async () => {
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

  it(`should reject on failed run `, async () => {
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
});
