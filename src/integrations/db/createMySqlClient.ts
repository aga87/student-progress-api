import mysql from 'mysql2/promise';

export type MySqlConfig = {
  database: string;
  host: string;
  port: number;
  user: string;
};

export const createMySqlClient = (config: MySqlConfig) => {
  return mysql.createPool(config);
};
