import {Entity, Column, PrimaryColumn} from 'typeorm';

export interface IDependencyVersionOptions {
    name: string;
    semver: string;
    version: string;
    repoUrl: string;
    releaseDate: string;
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
    })
    public releaseDate!: string;

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
