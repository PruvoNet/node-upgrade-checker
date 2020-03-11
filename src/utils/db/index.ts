import * as path from 'path';
import * as low from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';
import Lowdb = require('lowdb');

type ReferenceProperty = '@@reference';

interface IDbSchema {
    repos: string;
}

export class Db {
    private db: Lowdb.LowdbSync<Lowdb.AdapterSync<IDbSchema>[ReferenceProperty]>;

    constructor(private dir: string) {
        const adapter = new FileSync<IDbSchema>(path.join(this.dir, 'db.json'));
        this.db = low(adapter);
        this.db.defaults({posts: [], user: {}, count: 0})
            .write();
    }

    public getRepose() {
    }

}

