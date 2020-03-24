import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Moment } from 'moment';
import { buildDateTransformer } from '../impl/dateTransformer';
import { IEntity } from '../interfaces/IEntity';

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
  @PrimaryColumn(`text`)
  public name!: string;

  @PrimaryColumn(`text`)
  public version!: string;

  @Column(`text`)
  public repoUrl!: string;

  @Column(`text`, {
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
