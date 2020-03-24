import { testNameOrMultiConstraint } from '../../common/testers/bindingTester';
import { namedOrMultiConstraint } from '../../../src/container/utils';

describe(`utils`, () => {
  describe(`namedOrMultiConstraint`, () => {
    abstract class AClass {}
    const symbol = Symbol.for(`dep-name`);
    const constraint = namedOrMultiConstraint(symbol, AClass);
    testNameOrMultiConstraint(symbol, AClass, constraint);
  });
});
