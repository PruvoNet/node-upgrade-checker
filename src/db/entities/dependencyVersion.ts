import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Moment } from 'moment';
import { buildDateTransformer } from '../impl/dateTransformer';
import { IEntity } from '../interfaces/IEntity';

const dateFormat = `YYYY-MM-DD`;

export interface IDependencyVersionOptions {
  name: string;
  version: string;
  repoUrl: string | null;
  repoDirectory: string | null;
  releaseDate: Moment | null;
  commitSha: string | null;
  engines: string | null;
  testScript: string | null;
  buildScript: string | null;
}

@Entity()
export class DependencyVersion extends IEntity {
  public static TAG = Symbol.for(`DependencyVersion`);

  @PrimaryColumn(`text`)
  public name!: string;

  @PrimaryColumn(`text`)
  public version!: string;

  @Column(`text`, {
    nullable: true,
  })
  public repoUrl!: string | null;

  @Column(`text`, {
    nullable: true,
  })
  public repoDirectory!: string | null;

  @Column(`text`, {
    transformer: buildDateTransformer(dateFormat),
    nullable: true,
  })
  public releaseDate!: Moment | null;

  @Column(`text`, {
    nullable: true,
  })
  public commitSha!: string | null;

  @Column(`text`, {
    nullable: true,
  })
  public testScript!: string | null;

  @Column(`text`, {
    nullable: true,
  })
  public buildScript!: string | null;

  @Column(`text`, {
    nullable: true,
  })
  public engines!: string | null;

  constructor(options?: IDependencyVersionOptions) {
    super();
    if (options) {
      this.name = options.name;
      this.version = options.version;
      this.repoUrl = options.repoUrl;
      this.repoDirectory = options.repoDirectory;
      this.releaseDate = options.releaseDate;
      this.commitSha = options.commitSha;
      this.engines = options.engines;
      this.testScript = options.testScript;
      this.buildScript = options.buildScript;
    }
  }
}
