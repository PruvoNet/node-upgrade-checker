import { ILoggerSettings } from '../../../../../src/utils/logger';
import { LoggerFactory } from '../../../../../src/utils/logger/impl/loggerFactory';
import { LogLevel } from '../../../../../src/utils/logger/interfaces/ILogger';
import * as tmp from 'tmp';
import { FS } from '../../../../../src/container/nodeModulesContainer';
import { mock, mockReset } from 'jest-mock-extended';
import { getMockedStream, MockedStream } from '../../../../common/streams';
import { when } from 'jest-when';
import Process = NodeJS.Process;

const fileStreamOptions = {
  encoding: `utf8`,
  flags: `w`,
};

interface StreamResults {
  stdoutResult: string;
  stderrResult: string;
  logStreamResult: string;
  customLogStreamResult: string;
}

describe(`logger factory`, () => {
  const logFile = tmp.fileSync().name;
  const customLogFile = tmp.fileSync().name;
  const fsMock = mock<FS>();
  const processMock = mock<Process>();
  let stdoutMock: MockedStream;
  let stderrMock: MockedStream;
  let logStreamMock: MockedStream;
  let customLogStreamMock: MockedStream;

  const closeStreams = async (): Promise<StreamResults> => {
    stdoutMock.closeStream();
    stderrMock.closeStream();
    logStreamMock.closeStream();
    customLogStreamMock.closeStream();
    const stdoutResult = await stdoutMock.streamPromise;
    const stderrResult = await stderrMock.streamPromise;
    const logStreamResult = await logStreamMock.streamPromise;
    const customLogStreamResult = await customLogStreamMock.streamPromise;
    return {
      stdoutResult,
      stderrResult,
      logStreamResult,
      customLogStreamResult,
    };
  };

  beforeEach(() => {
    mockReset(fsMock);
    mockReset(processMock);
    stdoutMock = getMockedStream();
    stderrMock = getMockedStream();
    // @ts-ignore
    processMock.stdout = stdoutMock.mockedStream;
    // @ts-ignore
    processMock.stderr = stderrMock.mockedStream;
    logStreamMock = getMockedStream();
    customLogStreamMock = getMockedStream();
    // @ts-ignore
    when(fsMock.createWriteStream).calledWith(logFile, fileStreamOptions).mockReturnValue(logStreamMock.mockedStream);
    when(fsMock.createWriteStream)
      .calledWith(customLogFile, fileStreamOptions)
      // @ts-ignore
      .mockReturnValue(customLogStreamMock.mockedStream);
  });

  it(`should have proper logger level`, async () => {
    expect(LogLevel.ERROR).toBe(0);
    expect(LogLevel.WARN).toBe(1);
    expect(LogLevel.LOG).toBe(2);
    expect(LogLevel.INFO).toBe(3);
    expect(LogLevel.DEBUG).toBe(4);
    expect(LogLevel.TRACE).toBe(5);
    expect(LogLevel.SILENT).toBe(6);
    expect(LogLevel.VERBOSE).toBe(7);
  });

  it(`should set reporter default log level`, async () => {
    const settings: ILoggerSettings = {
      logLevel: undefined,
      logFile: undefined,
      customLogFile: undefined,
    };
    const loggerFactory = new LoggerFactory(settings, processMock, fsMock);
    const logger = loggerFactory.getLogger(`test`);
    logger.error(`error`);
    logger.log(`test`);
    logger.debug(`debug`);
    const results = await closeStreams();
    expect(results.customLogStreamResult).toBe(``);
    expect(results.logStreamResult).toBe(``);
    expect(results.stderrResult).toContain(`error`);
    expect(results.stdoutResult).toContain(`test`);
    expect(results.stdoutResult).not.toContain(`debug`);
  });

  it(`should set reporter with custom log level`, async () => {
    const settings: ILoggerSettings = {
      logLevel: LogLevel.WARN,
      logFile: undefined,
      customLogFile: undefined,
    };
    const loggerFactory = new LoggerFactory(settings, processMock, fsMock);
    const logger = loggerFactory.getLogger(`test`);
    logger.error(`error`);
    logger.log(`test`);
    logger.debug(`debug`);
    const results = await closeStreams();
    expect(results.customLogStreamResult).toBe(``);
    expect(results.logStreamResult).toBe(``);
    expect(results.stderrResult).toContain(`error`);
    expect(results.stdoutResult).not.toContain(`test`);
    expect(results.stdoutResult).not.toContain(`debug`);
  });

  it(`should set file log reporter`, async () => {
    const settings: ILoggerSettings = {
      logLevel: undefined,
      logFile,
      customLogFile: undefined,
    };
    const loggerFactory = new LoggerFactory(settings, processMock, fsMock);
    const logger = loggerFactory.getLogger(`test`);
    logger.error(`error`);
    logger.log(`test`);
    logger.debug(`debug`);
    const results = await closeStreams();
    expect(results.customLogStreamResult).toBe(``);
    expect(results.logStreamResult).toContain(`test`);
    expect(results.logStreamResult).toContain(`debug`);
    expect(results.logStreamResult).toContain(`error`);
    expect(results.stderrResult).toContain(`error`);
    expect(results.stdoutResult).toContain(`test`);
    expect(results.stdoutResult).not.toContain(`debug`);
  });

  it(`should set custom file log reporter`, async () => {
    const settings: ILoggerSettings = {
      logLevel: undefined,
      logFile: undefined,
      customLogFile,
    };
    const loggerFactory = new LoggerFactory(settings, processMock, fsMock);
    const logger = loggerFactory.getLogger(`test`);
    logger.error(`error`);
    logger.log(`test`);
    logger.debug(`debug`);
    const results = await closeStreams();
    expect(results.logStreamResult).toBe(``);
    expect(results.customLogStreamResult).toContain(`test`);
    expect(results.customLogStreamResult).toContain(`error`);
    expect(results.customLogStreamResult).not.toContain(`debug`);
    expect(results.stderrResult).toContain(`error`);
    expect(results.logStreamResult).toBe(``);
  });

  it(`should set all file log reporters`, async () => {
    const settings: ILoggerSettings = {
      logLevel: undefined,
      logFile,
      customLogFile,
    };
    const loggerFactory = new LoggerFactory(settings, processMock, fsMock);
    const logger = loggerFactory.getLogger(`test`);
    logger.error(`error`);
    logger.log(`test`);
    logger.debug(`debug`);
    const results = await closeStreams();
    expect(results.logStreamResult).toContain(`test`);
    expect(results.logStreamResult).toContain(`debug`);
    expect(results.logStreamResult).toContain(`error`);
    expect(results.customLogStreamResult).toContain(`test`);
    expect(results.customLogStreamResult).toContain(`error`);
    expect(results.customLogStreamResult).not.toContain(`debug`);
    expect(results.stderrResult).toContain(`error`);
    expect(results.stdoutResult).toBe(``);
  });

  it(`should cache logger`, async () => {
    const settings: ILoggerSettings = {
      logLevel: undefined,
      logFile: undefined,
      customLogFile: undefined,
    };
    const loggerFactory = new LoggerFactory(settings, processMock, fsMock);
    const logger1 = loggerFactory.getLogger(`test`);
    const logger2 = loggerFactory.getLogger(`test`);
    const logger3 = loggerFactory.getLogger(`test2`);
    expect(logger1).toBe(logger2);
    expect(logger1).not.toBe(logger3);
  });
});
