import {Entity, Column, PrimaryColumn} from 'typeorm';


export interface IDependencyOptions {
    name: string;
    version: string;
    targetNode: string;
    match?: boolean;
    reason?: string;
}

@Entity()
export class Dependency {

    @PrimaryColumn({
        nullable: false,
        type: 'text',
        unique: true,
    })
    public name!: string;

    @PrimaryColumn({
        nullable: false,
        type: 'text',
        unique: true,
    })
    public version!: string;

    @PrimaryColumn({
        nullable: false,
        type: 'text',
        unique: true,
    })
    public targetNode!: string;

    @Column({
        nullable: true,
        type: 'boolean',
    })
    public match!: boolean | undefined;

    @Column({
        nullable: true,
        type: 'text',
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
