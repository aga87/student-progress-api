import mysql from 'mysql2/promise';

export type MySqlConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

export const createMySqlClient = (config: MySqlConfig) => {
  return mysql.createPool(config);
};
