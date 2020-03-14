import {injectable} from 'inversify';

export interface INpmOptions {
    npmCommand: string;
    cwd: string;
}

@injectable()
export abstract class INpm {
    abstract async build(options: INpmOptions): Promise<void>;

    abstract async install(options: INpmOptions): Promise<void>;

    abstract async test(options: INpmOptions): Promise<void>;
}
