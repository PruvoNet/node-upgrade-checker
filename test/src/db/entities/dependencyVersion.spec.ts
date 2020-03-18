import {DependencyVersion} from '../../../../src/db';
import moment = require('moment');

describe(`dependencyVersion entity`, () => {
    it(`should set properties from constructor`, async () => {
        const releaseDate = moment.utc();
        const dependency = new DependencyVersion({
            version: '4.0.1',
            name: 'test dependency',
            repoUrl: 'https://www.github.com/example/test.git',
            commitSha: 'sdf-sdf-sdf-sdf-wert-fdgf',
            releaseDate,
        });
        expect(dependency.version).toBe('4.0.1');
        expect(dependency.name).toBe('test dependency');
        expect(dependency.repoUrl).toBe('https://www.github.com/example/test.git');
        expect(dependency.commitSha).toBe('sdf-sdf-sdf-sdf-wert-fdgf');
        expect(dependency.releaseDate.toJSON()).toBe(releaseDate.toJSON());
    });
    it(`should work with empty constructor`, async () => {
        const dependency = new DependencyVersion();
        expect(dependency.version).toBeUndefined();
        expect(dependency.name).toBeUndefined();
        expect(dependency.repoUrl).toBeUndefined();
        expect(dependency.commitSha).toBeUndefined();
        expect(dependency.releaseDate).toBeUndefined();
    });
});
