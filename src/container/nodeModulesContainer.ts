import * as typeorm from 'typeorm';
import * as fs from 'fs';
import * as pacote from 'pacote';
import * as simpleGit from 'simple-git/promise';
import * as spawn from 'cross-spawn';
import { interfaces } from 'inversify';
import Bind = interfaces.Bind;

export type Spawn = typeof spawn;
export type Pacote = typeof pacote;
export type FS = typeof fs;
export type TypeOrm = typeof typeorm;
export type SimpleGitFn = typeof simpleGit;
export const TYPES = {
  TypeOrm: Symbol.for(`TypeOrm`),
  FS: Symbol.for(`FS`),
  Pacote: Symbol.for(`Pacote`),
  Spawn: Symbol.for(`Spawn`),
  SimpleGit: Symbol.for(`SimpleGit`),
};

export const nodeModulesBinder = (bind: Bind): void => {
  bind<TypeOrm>(TYPES.TypeOrm).toConstantValue(typeorm);
  bind<FS>(TYPES.FS).toConstantValue(fs);
  bind<Pacote>(TYPES.Pacote).toConstantValue(pacote);
  bind<Spawn>(TYPES.Spawn).toConstantValue(spawn);
  bind<SimpleGitFn>(TYPES.SimpleGit).toConstantValue(simpleGit);
};
