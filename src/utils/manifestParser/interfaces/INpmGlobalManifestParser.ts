import { IPackageData } from '../types';
import { IPredicate } from '../../predicateBuilder/predicateBuilder';

export interface INpmGlobalManifest {
  dependencies?: Record<string, { version: string }>;
}

export interface INpmGlobalManifestParserOptions {
  manifest: INpmGlobalManifest;
  predicate: IPredicate;
}

export abstract class INpmGlobalManifestParser {
  public abstract async parse(options: INpmGlobalManifestParserOptions): Promise<IPackageData>;
}
