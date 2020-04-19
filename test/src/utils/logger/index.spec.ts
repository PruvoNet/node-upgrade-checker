import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import { ILoggerFactory, loggerModuleBinder } from '../../../../src/utils/logger';
import { LoggerFactory } from '../../../../src/utils/logger/impl/loggerFactory';

testBindings({
  name: `logger module container`,
  binderFn: loggerModuleBinder,
  bindings: [
    {
      binder: ILoggerFactory,
      binded: LoggerFactory,
      type: BindingTypes.SINGELTON,
    },
  ],
});
