import {injectable} from 'inversify';

@injectable()
export class ConnectionProviderSettings {
    constructor(public readonly databaseFilePath: string, public readonly dropSchema: boolean) {
    }
}
