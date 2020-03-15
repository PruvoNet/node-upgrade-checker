import {injectable} from 'inversify';

export interface IRunFlowOptions {
    pkg: {
        version: string;
        name: string;
    };
    repo: {
        url: string;
        commitSha?: string;
    };
    workDir: string;
    nvmBinDir: string;
    targetNode: string;
}

export interface IRunFlowResult {
    isMatch: boolean;
    resolverName?: string;
}

@injectable()
export abstract class IFlow {
    public abstract async runFlow(options: IRunFlowOptions): Promise<IRunFlowResult>;
}
