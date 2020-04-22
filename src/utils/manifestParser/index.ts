import { interfaces } from 'inversify';
import Bind = interfaces.Bind;
import { IManifestParser } from './interfaces/IManifestParser';
import { ManifestParser } from './impl/manifestParser';
import { INpmGlobalManifestParser } from './interfaces/INpmGlobalManifestParser';
import { NpmGlobalManifestParser } from './impl/npmGlobalManifestParser';

export const manifestParserModulesBinder = (bind: Bind): void => {
  bind<IManifestParser>(IManifestParser).to(ManifestParser).inSingletonScope();
  bind<INpmGlobalManifestParser>(INpmGlobalManifestParser).to(NpmGlobalManifestParser).inSingletonScope();
};

export * from './interfaces/IManifestParser';
export * from './interfaces/INpmGlobalManifestParser';
export * from './types';
