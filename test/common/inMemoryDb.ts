import { Connection, createConnection } from 'typeorm';

// eslint-disable-next-line @typescript-eslint/ban-types
export const getInMemoryDb = async (entity: Function): Promise<Connection> => {
  return createConnection({
    name: Math.random().toString(36).substring(7),
    type: `sqlite`,
    database: `:memory:`,
    dropSchema: true,
    entities: [entity],
    synchronize: true,
    logging: false,
  });
};
