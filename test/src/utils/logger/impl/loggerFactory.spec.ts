import { ILoggerSettings } from '../../../../../src/utils/logger';
import { LoggerFactory } from '../../../../../src/utils/logger/impl/loggerFactory';
// @ts-ignore
import { Consola, FancyReporter } from 'consola';
import { LogLevel } from '../../../../../src/utils/logger/interfaces/ILogger';

describe(`logger factory`, () => {
  it(`should have proper logger level`, async () => {
    expect(LogLevel.ERROR).toBe(0);
    expect(LogLevel.WARN).toBe(1);
    expect(LogLevel.LOG).toBe(2);
    expect(LogLevel.INFO).toBe(3);
    expect(LogLevel.DEBUG).toBe(4);
    expect(LogLevel.TRACE).toBe(5);
    expect(LogLevel.SILENT).toBe(6);
  });
  it(`should set reporter`, async () => {
    const settings: ILoggerSettings = {
      logLevel: undefined,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isSilent()).toBe(false);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isDebugEnabled()).toBe(false);
    expect(logger.isInfoEnabled()).toBe(true);
    expect(logger.isLogEnabled()).toBe(true);
    expect(logger.isWarnEnabled()).toBe(true);
    expect(logger.isErrorEnabled()).toBe(true);
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const reporters = logger._reporters;
    expect(reporters.length).toBe(1);
    expect(reporters[0]).toBeInstanceOf(FancyReporter);
  });
  it(`should set debug log level from settings`, async () => {
    const settings: ILoggerSettings = {
      logLevel: LogLevel.DEBUG,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isSilent()).toBe(false);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isDebugEnabled()).toBe(true);
    expect(logger.isInfoEnabled()).toBe(true);
    expect(logger.isLogEnabled()).toBe(true);
    expect(logger.isWarnEnabled()).toBe(true);
    expect(logger.isErrorEnabled()).toBe(true);
  });
  it(`should set trace log level from settings`, async () => {
    const settings: ILoggerSettings = {
      logLevel: LogLevel.TRACE,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.isSilent()).toBe(false);
    expect(logger.isTraceEnabled()).toBe(true);
    expect(logger.isDebugEnabled()).toBe(true);
    expect(logger.isInfoEnabled()).toBe(true);
    expect(logger.isLogEnabled()).toBe(true);
    expect(logger.isWarnEnabled()).toBe(true);
    expect(logger.isErrorEnabled()).toBe(true);
  });

  it(`should not set info log level from settings`, async () => {
    const settings: ILoggerSettings = {
      logLevel: LogLevel.INFO,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isSilent()).toBe(false);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isDebugEnabled()).toBe(false);
    expect(logger.isInfoEnabled()).toBe(true);
    expect(logger.isLogEnabled()).toBe(true);
    expect(logger.isWarnEnabled()).toBe(true);
    expect(logger.isErrorEnabled()).toBe(true);
  });

  it(`should not set log log level from settings`, async () => {
    const settings: ILoggerSettings = {
      logLevel: LogLevel.LOG,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isSilent()).toBe(false);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isDebugEnabled()).toBe(false);
    expect(logger.isInfoEnabled()).toBe(false);
    expect(logger.isLogEnabled()).toBe(true);
    expect(logger.isWarnEnabled()).toBe(true);
    expect(logger.isErrorEnabled()).toBe(true);
  });

  it(`should not set warn log level from settings`, async () => {
    const settings: ILoggerSettings = {
      logLevel: LogLevel.WARN,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isSilent()).toBe(false);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isDebugEnabled()).toBe(false);
    expect(logger.isInfoEnabled()).toBe(false);
    expect(logger.isLogEnabled()).toBe(false);
    expect(logger.isWarnEnabled()).toBe(true);
    expect(logger.isErrorEnabled()).toBe(true);
  });

  it(`should not set error log level from settings`, async () => {
    const settings: ILoggerSettings = {
      logLevel: LogLevel.ERROR,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isSilent()).toBe(false);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isDebugEnabled()).toBe(false);
    expect(logger.isInfoEnabled()).toBe(false);
    expect(logger.isLogEnabled()).toBe(false);
    expect(logger.isWarnEnabled()).toBe(false);
    expect(logger.isErrorEnabled()).toBe(true);
  });

  it(`should not set silent log level from settings`, async () => {
    const settings: ILoggerSettings = {
      logLevel: LogLevel.SILENT,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isSilent()).toBe(true);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isDebugEnabled()).toBe(false);
    expect(logger.isInfoEnabled()).toBe(false);
    expect(logger.isLogEnabled()).toBe(false);
    expect(logger.isWarnEnabled()).toBe(false);
    expect(logger.isErrorEnabled()).toBe(false);
  });

  it(`should cache logger`, async () => {
    const settings: ILoggerSettings = {
      logLevel: undefined,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger1 = loggerFactory.getLogger(`test`);
    const logger2 = loggerFactory.getLogger(`test`);
    const logger3 = loggerFactory.getLogger(`test2`);
    expect(logger1).toBe(logger2);
    expect(logger1).not.toBe(logger3);
  });
});
