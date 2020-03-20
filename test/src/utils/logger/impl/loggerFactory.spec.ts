import { ILoggerFactory, ILoggerSettings } from '../../../../../src/utils/logger';
import { LoggerFactory } from '../../../../../src/utils/logger/impl/loggerFactory';
// @ts-ignore
import { Consola, FancyReporter } from 'consola';

describe(`logger factory`, () => {
  it(`should have proper logger level`, async () => {
    expect(ILoggerFactory.LEVELS.INFO).toBe(3);
    expect(ILoggerFactory.LEVELS.DEBUG).toBe(4);
    expect(ILoggerFactory.LEVELS.TRACE).toBe(5);
  });
  it(`should set reporter`, async () => {
    const settings: ILoggerSettings = {
      debugMode: true,
      traceMode: true,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger();
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.level).toBe(ILoggerFactory.LEVELS.TRACE);
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
    const logger = loggerFactory.getLogger();
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.level).toBe(ILoggerFactory.LEVELS.DEBUG);
    expect(loggerFactory.isDebugEnabled()).toBe(true);
    expect(loggerFactory.isTraceEnabled()).toBe(false);
  });
  it(`should set trace log level from settings`, async () => {
    const settings: ILoggerSettings = {
      debugMode: false,
      traceMode: true,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger();
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.level).toBe(ILoggerFactory.LEVELS.TRACE);
    expect(loggerFactory.isDebugEnabled()).toBe(true);
    expect(loggerFactory.isTraceEnabled()).toBe(true);
  });

  it(`should not set debug log level from settings`, async () => {
    const settings: ILoggerSettings = {
      debugMode: false,
      traceMode: false,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger();
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.level).toBe(ILoggerFactory.LEVELS.INFO);
    expect(loggerFactory.isDebugEnabled()).toBe(false);
    expect(loggerFactory.isTraceEnabled()).toBe(false);
  });

  it(`should cache logger`, async () => {
    const settings: ILoggerSettings = {
      debugMode: true,
      traceMode: false,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger1 = loggerFactory.getLogger();
    const logger2 = loggerFactory.getLogger();
    expect(logger1).toBe(logger2);
  });
});
