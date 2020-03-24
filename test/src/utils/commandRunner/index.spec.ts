import { BindingTypes, testBindings } from '../../../common/testers/bindingTester';
import { ICommandRunner, commandRunnerModuleBinder } from '../../../../src/utils/commandRunner';
import { CommandRunner } from '../../../../src/utils/commandRunner/impl/commandRunner';

testBindings({
  name: `runner module container`,
  binderFn: commandRunnerModuleBinder,
  bindings: [
    {
      binder: ICommandRunner,
      binded: CommandRunner,
      type: BindingTypes.SINGELTON,
    },
  ],
});
