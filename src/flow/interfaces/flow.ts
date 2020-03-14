import {injectable} from 'inversify';

export interface IRunFlowOptions {
    repo: string;
}

@injectable()
export abstract class IFlow {
    public abstract async runFlow(options: IRunFlowOptions): Promise<boolean>;
}
