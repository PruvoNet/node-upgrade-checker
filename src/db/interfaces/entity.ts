import { injectable } from 'inversify';
import { Entity } from 'typeorm';

@Entity()
@injectable()
export abstract class IEntity {}

export type IEntityConstructor = typeof IEntity;
