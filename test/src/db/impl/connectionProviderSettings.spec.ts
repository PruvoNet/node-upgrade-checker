import {ConnectionSettings} from '../../../../src/db';

describe(`connection settings`, () => {

    it(`should expose properties properly`, async () => {
        const settings = new ConnectionSettings(`/tmp`, false);
        expect(settings.dropSchema).toBe(false);
        expect(settings.databaseFilePath).toBe(`/tmp`);
    });

    it(`should expose properties properly 2`, async () => {
        const settings = new ConnectionSettings(`/tmp`, true);
        expect(settings.dropSchema).toBe(true);
        expect(settings.databaseFilePath).toBe(`/tmp`);
    });

});
