import * as typeorm from 'typeorm';
import * as fs from 'fs';
import * as simplegit from 'simple-git/promise';
import * as pacote from 'pacote';
import * as childProcess from 'child_process';
import { BindingTypes, testBindings } from '../../common/bindingTester';
import { nodeModulesBinder, TYPES } from '../../../src/container/nodeModulesContainer';

testBindings({
  name: `node module container`,
  binderFn: nodeModulesBinder,
  bindings: [
    {
      binder: TYPES.TypeOrm,
      binded: typeorm,
      type: BindingTypes.CONSTANT,
    },
    {
      binder: TYPES.FS,
      binded: fs,
      type: BindingTypes.CONSTANT,
    },
    {
      binder: TYPES.Pacote,
      binded: pacote,
      type: BindingTypes.CONSTANT,
    },
    {
      binder: TYPES.ChildProcess,
      binded: childProcess,
      type: BindingTypes.CONSTANT,
    },
    {
      binder: TYPES.SimpleGit,
      binded: simplegit,
      type: BindingTypes.CONSTANT,
    },
  ],
});
