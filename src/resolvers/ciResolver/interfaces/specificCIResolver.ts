import {injectable} from 'inversify';

export interface ISpecificCIResolverOptions {
    repoPath: string;
}

export const LTS_VERSION = Symbol.for('LTS_VERSION');

@injectable()
export abstract class ISpecificCIResolver {
    public abstract async resolve(options: ISpecificCIResolverOptions): Promise<string[] | undefined>;
    public abstract readonly resolverName: string;
}

