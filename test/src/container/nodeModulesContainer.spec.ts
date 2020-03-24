import * as typeorm from 'typeorm';
import * as fs from 'fs';
import * as simplegit from 'simple-git/promise';
import * as pacote from 'pacote';
import * as spawn from 'cross-spawn';
import axios from 'axios';
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
      binder: TYPES.Spawn,
      binded: spawn,
      type: BindingTypes.CONSTANT,
    },
    {
      binder: TYPES.SimpleGit,
      binded: simplegit,
      type: BindingTypes.CONSTANT,
    },
    {
      binder: TYPES.Axios,
      binded: axios,
      type: BindingTypes.CONSTANT,
    },
  ],
});
