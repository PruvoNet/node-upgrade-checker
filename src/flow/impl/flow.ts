import {injectable} from 'inversify';
import {IFlow, IRunFlowOptions} from '../interfaces/flow';

@injectable()
export class Flow extends IFlow {
    public async runFlow(options: IRunFlowOptions): Promise<boolean> {
        return true;
    }
}
