import {injectable} from 'inversify';
import {ILts, ILtsOptions} from '../interfaces/lts';
import moment = require('moment');
import {Moment} from 'moment';

const dateFormat = `YYYY-MM-DD`;

interface ILtsVersion {
    version: string;
    from: Moment;
    to: Moment;
}

// taken from https://en.wikipedia.org/wiki/Node.js
const nodesByDate: ILtsVersion[] = [
    {
        version: '4',
        from: moment.utc('2015-10-01', dateFormat),
        to: moment.utc('2018-04-30', dateFormat),
    },
    {
        version: '6',
        from: moment.utc('2016-10-18', dateFormat),
        to: moment.utc('2019-04-30', dateFormat),
    },
    {
        version: '8',
        from: moment.utc('2017-10-31', dateFormat),
        to: moment.utc('2019-12-31', dateFormat),
    },
    {
        version: '10',
        from: moment.utc('2018-10-30', dateFormat),
        to: moment.utc('2021-04-01', dateFormat),
    },
    {
        version: '12',
        from: moment.utc('2019-10-22', dateFormat),
        to: moment.utc('2022-04-01', dateFormat),
    },
    {
        version: '14',
        from: moment.utc('2020-10-20', dateFormat),
        to: moment.utc('2023-04-30', dateFormat),
    },
];

@injectable()
export class Lts extends ILts {
    async resolveLtsVersion({date}: ILtsOptions): Promise<string[]> {
        return nodesByDate
            .filter((lts: ILtsVersion) => {
                return lts.from.isBefore(date) && lts.to.isAfter(date);
            })
            .map((lts: ILtsVersion) => {
                return lts.version;
            });
    }

}

