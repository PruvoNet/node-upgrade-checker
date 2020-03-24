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
  });
  it(`should set reporter`, async () => {
    const settings: ILoggerSettings = {
      debugMode: true,
      traceMode: true,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isTraceEnabled()).toBe(true);
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    const reporters = logger._reporters;
    expect(reporters.length).toBe(1);
    expect(reporters[0]).toBeInstanceOf(FancyReporter);
  });
  it(`should set debug log level from settings`, async () => {
    const settings: ILoggerSettings = {
      debugMode: true,
      traceMode: false,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isDebugEnabled()).toBe(true);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isInfoEnabled()).toBe(true);
    expect(logger.isWarnEnabled()).toBe(true);
  });
  it(`should set trace log level from settings`, async () => {
    const settings: ILoggerSettings = {
      debugMode: false,
      traceMode: true,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.isDebugEnabled()).toBe(true);
    expect(logger.isTraceEnabled()).toBe(true);
    expect(logger.isInfoEnabled()).toBe(true);
    expect(logger.isWarnEnabled()).toBe(true);
  });

  it(`should not set debug log level from settings`, async () => {
    const settings: ILoggerSettings = {
      debugMode: false,
      traceMode: false,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger(`test`);
    expect(logger.isInfoEnabled()).toBe(true);
    expect(logger.isDebugEnabled()).toBe(false);
    expect(logger.isTraceEnabled()).toBe(false);
    expect(logger.isWarnEnabled()).toBe(true);
  });

  it(`should cache logger`, async () => {
    const settings: ILoggerSettings = {
      debugMode: true,
      traceMode: false,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger1 = loggerFactory.getLogger(`test`);
    const logger2 = loggerFactory.getLogger(`test`);
    const logger3 = loggerFactory.getLogger(`test2`);
    expect(logger1).toBe(logger2);
    expect(logger1).not.toBe(logger3);
  });
});
