import 'reflect-metadata';
import { container } from '../src/container';
import { ILoggerSettings, LoggerSettings } from '../src/utils/logger';

container.bind<ILoggerSettings>(ILoggerSettings).toConstantValue(new LoggerSettings(true, true));
