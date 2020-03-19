import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Moment } from 'moment';
import { buildDateTransformer } from '../utils/dateTransformer';
import { IEntity } from '../interfaces/entity';

const dateFormat = `YYYY-MM-DD`;

export interface IDependencyVersionOptions {
  name: string;
  version: string;
  repoUrl: string;
  releaseDate: Moment;
  commitSha: string;
}

@Entity()
export class DependencyVersion extends IEntity {
  @PrimaryColumn(`text`, {
    nullable: false,
  })
  public name!: string;

  @PrimaryColumn(`text`, {
    nullable: false,
  })
  public version!: string;

  @Column(`text`, {
    nullable: false,
  })
  public repoUrl!: string;

  @Column(`text`, {
    nullable: false,
    transformer: buildDateTransformer(dateFormat),
  })
  public releaseDate!: Moment;

  @Column(`text`, {
    nullable: true,
  })
  public commitSha!: string;

  constructor(options?: IDependencyVersionOptions) {
    super();
    if (options) {
      this.name = options.name;
      this.version = options.version;
      this.repoUrl = options.repoUrl;
      this.releaseDate = options.releaseDate;
      this.commitSha = options.commitSha;
    }
  }
}
