import { ILoggerSettings } from '../../../../../src/utils/logger';
import { LoggerFactory } from '../../../../../src/utils/logger/impl/loggerFactory';
import { Consola } from 'consola';

describe(`connection provider`, () => {
  it(`should set debug log level from settings`, async () => {
    const settings: ILoggerSettings = {
      debugMode: true,
      traceMode: false,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger();
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.level).toBe(4);
  });
  it(`should set trace log level from settings`, async () => {
    const settings: ILoggerSettings = {
      debugMode: false,
      traceMode: true,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger();
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.level).toBe(5);
  });

  it(`should not set debug log level from settings`, async () => {
    const settings: ILoggerSettings = {
      debugMode: false,
      traceMode: false,
    };
    const loggerFactory = new LoggerFactory(settings);
    const logger = loggerFactory.getLogger();
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.level).toBe(3);
  });

  it(`should set trace log level if no settings`, async () => {
    const loggerFactory = new LoggerFactory();
    const logger = loggerFactory.getLogger();
    expect(logger).toBeInstanceOf(Consola);
    expect(logger.level).toBe(5);
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
