import { IPredicate } from '../../predicateBuilder/predicateBuilder';
import { Manifest } from 'pacote';
import { IPackageData } from '../types';

export interface IManifestParserOptions {
  manifest: Manifest;
  include: {
    prod: boolean;
    dev: boolean;
    optional: boolean;
    peer: boolean;
  };
  predicate: IPredicate;
}

export abstract class IManifestParser {
  public abstract async parse(options: IManifestParserOptions): Promise<IPackageData>;
}
