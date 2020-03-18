import {Entity, Column, PrimaryColumn} from 'typeorm';

export interface IDependencyOptions {
    name: string;
    version: string;
    targetNode: string;
    match: boolean | undefined;
    reason: string | undefined;
}

@Entity()
export class Dependency {

    @PrimaryColumn(`text`, {
        nullable: false,
    })
    public name!: string;

    @PrimaryColumn(`text`, {
        nullable: false,
    })
    public version!: string;

    @PrimaryColumn(`text`, {
        nullable: false,
    })
    public targetNode!: string;

    @Column(`boolean`, {
        nullable: true,
    })
    public match!: boolean | undefined;

    @Column(`text`, {
        nullable: true,
    })
    public reason!: string | undefined;

    constructor(options?: IDependencyOptions) {
        if (options) {
            this.name = options.name;
            this.version = options.version;
            this.targetNode = options.targetNode;
            this.match = options.match;
            this.reason = options.reason;
        }
    }
}
