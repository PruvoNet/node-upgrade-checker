import {Entity, Column, PrimaryColumn} from 'typeorm';
import {Moment} from 'moment';

const dateFormat = `YYYY-MM-DD`;
import moment = require('moment');

export interface IDependencyVersionOptions {
    name: string;
    semver: string;
    version: string;
    repoUrl: string;
    releaseDate: Moment;
    commitSha?: string;
}

@Entity()
export class DependencyVersion {

    @PrimaryColumn('text', {
        nullable: false,
    })
    public name!: string;

    @PrimaryColumn('text', {
        nullable: false,
    })
    public semver!: string;

    @Column('text', {
        nullable: false,
    })
    public version!: string;

    @Column('text', {
        nullable: false,
    })
    public repoUrl!: string;

    @Column('text', {
        nullable: false,
        transformer: {
            to(value: Moment): string {
                return value.format(dateFormat);
            },
            from(value: string): Moment {
                return moment.utc(value, dateFormat);
            },
        },
    })
    public releaseDate!: Moment;

    @Column('text', {
        nullable: true,
    })
    public commitSha!: string | undefined;

    constructor(options?: IDependencyVersionOptions) {
        if (options) {
            this.name = options.name;
            this.semver = options.semver;
            this.version = options.version;
            this.repoUrl = options.repoUrl;
            this.releaseDate = options.releaseDate;
            this.commitSha = options.commitSha;
        }
    }
}
