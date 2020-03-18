import {Dependency} from '../../../../src/db';

describe(`dependency entity`, () => {
    it(`should set properties from constructor`, async () => {
        const dependency = new Dependency({
            targetNode: '12',
            version: '4.0.1',
            name: 'test',
            reason: undefined,
            match: undefined,
        });
        expect(dependency.targetNode).toBe('12');
        expect(dependency.version).toBe('4.0.1');
        expect(dependency.name).toBe('test');
        expect(dependency.reason).toBeUndefined();
        expect(dependency.match).toBeUndefined();
    });
    it(`should set properties from constructor full`, async () => {
        const dependency = new Dependency({
            targetNode: '12',
            version: '4.0.1',
            name: 'test',
            reason: `my reason`,
            match: true,
        });
        expect(dependency.targetNode).toBe('12');
        expect(dependency.version).toBe('4.0.1');
        expect(dependency.name).toBe('test');
        expect(dependency.reason).toBe(`my reason`);
        expect(dependency.match).toBe(true);
    });
    it(`should set properties from constructor full 2`, async () => {
        const dependency = new Dependency({
            targetNode: '12',
            version: '4.0.1',
            name: 'test',
            reason: `my reason`,
            match: false,
        });
        expect(dependency.targetNode).toBe('12');
        expect(dependency.version).toBe('4.0.1');
        expect(dependency.name).toBe('test');
        expect(dependency.reason).toBe(`my reason`);
        expect(dependency.match).toBe(false);
    });
    it(`should work with empty constructor`, async () => {
        const dependency = new Dependency();
        expect(dependency.targetNode).toBeUndefined();
        expect(dependency.version).toBeUndefined();
        expect(dependency.name).toBeUndefined();
        expect(dependency.reason).toBeUndefined();
        expect(dependency.match).toBeUndefined();
    });
});
