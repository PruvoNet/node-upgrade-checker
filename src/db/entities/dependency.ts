import { Entity, Column, PrimaryColumn } from 'typeorm';
import { IEntity } from '../interfaces/IEntity';

export interface IDependencyOptionsBase {
  name: string;
  version: string;
  targetNode: string;
}

export interface IDependencyOptionsMatch extends IDependencyOptionsBase {
  match: true;
  reason: string;
}

export interface IDependencyOptionsNoMatch extends IDependencyOptionsBase {
  match: false;
  reason: null;
}

export type IDependencyOptions = IDependencyOptionsMatch | IDependencyOptionsNoMatch;

@Entity()
export class Dependency extends IEntity {
  public static TAG = Symbol.for(`Dependency`);

  @PrimaryColumn(`text`)
  public name!: string;

  @PrimaryColumn(`text`)
  public version!: string;

  @PrimaryColumn(`text`)
  public targetNode!: string;

  @Column(`boolean`)
  public match!: boolean;

  @Column(`text`, {
    nullable: true,
  })
  public reason!: string | null;

  constructor(options?: IDependencyOptions) {
    super();
    if (options) {
      this.name = options.name;
      this.version = options.version;
      this.targetNode = options.targetNode;
      this.match = options.match;
      this.reason = options.reason;
    }
  }
}
