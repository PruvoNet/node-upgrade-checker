import { BindingTypes, testBindings } from '../../../common/bindingTester';
import { ILoggerFactory, ILoggerSettings, loggerModuleBinder, LoggerSettings } from '../../../../src/utils/logger';
import { LoggerFactory } from '../../../../src/utils/logger/impl/loggerFactory';

testBindings({
  name: `logger module container`,
  binderFn: loggerModuleBinder,
  bindings: [
    {
      binder: ILoggerSettings,
      binded: LoggerSettings,
      type: BindingTypes.SINGELTON,
    },
    {
      binder: ILoggerFactory,
      binded: LoggerFactory,
      type: BindingTypes.SINGELTON,
    },
  ],
});
