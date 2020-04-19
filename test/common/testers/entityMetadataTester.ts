/* eslint-disable jest/no-export */
import { Connection } from 'typeorm';
import { IEntityConstructor } from '../../../src/db/interfaces/IEntity';
import { ColumnType } from 'typeorm/driver/types/ColumnTypes';
import { getInMemoryDb } from '../inMemoryDb';

export interface ColumnMatcher {
  databaseName: string;
  isPrimary: boolean;
  isNullable: boolean;
  type: ColumnType;
}

export const entityMetadataTester = <T extends IEntityConstructor>(entity: T, columns: ColumnMatcher[]): void => {
  describe(`metadata of entity ${entity}`, () => {
    let connection: Connection;

    beforeAll(async () => {
      connection = await getInMemoryDb(entity);
    });

    afterAll(async () => {
      await connection.close();
    });

    it(`Should be configured properly`, () => {
      const meta = connection.getMetadata(entity);
      const matchers = columns.map((col) => {
        return expect.objectContaining(col);
      });
      expect(meta.columns).toHaveLength(columns.length);
      expect(meta.columns).toEqual(expect.arrayContaining(matchers));
    });
  });
};
