import * as typeorm from 'typeorm';
import * as fs from 'fs';
import * as nodeGit from 'nodegit';
import * as pacote from 'pacote';
import * as childProcess from 'child_process';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export type ChildProcess = typeof childProcess;
export type Pacote = typeof pacote;
export type NodeGit = typeof nodeGit;
export type FS = typeof fs;
export type TypeOrm = typeof typeorm;
export const TYPES = {
  TypeOrm: Symbol.for(`TypeOrm`),
  FS: Symbol.for(`FS`),
  NodeGit: Symbol.for(`NodeGit`),
  Pacote: Symbol.for(`Pacote`),
  ChildProcess: Symbol.for(`ChildProcess`),
};

export const nodeModulesBinder = (bind: Bind): void => {
  bind<TypeOrm>(TYPES.TypeOrm).toConstantValue(typeorm);
  bind<FS>(TYPES.FS).toConstantValue(fs);
  bind<NodeGit>(TYPES.NodeGit).toConstantValue(nodeGit);
  bind<Pacote>(TYPES.Pacote).toConstantValue(pacote);
  bind<ChildProcess>(TYPES.ChildProcess).toConstantValue(childProcess);
};
