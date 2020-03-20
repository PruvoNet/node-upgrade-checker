import 'reflect-metadata';
import { container } from '../src/container';
import { ILoggerSettings } from '../src/utils/logger';
import { loggerSettings } from './common/logger';

container.bind<ILoggerSettings>(ILoggerSettings).toConstantValue(loggerSettings);
