import {injectable} from 'inversify';

@injectable()
export class ConnectionProviderSettings {
    constructor(public readonly databaseFile: string, public readonly dropSchema: boolean) {
    }
}
