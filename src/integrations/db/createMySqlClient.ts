import { Connector, AuthTypes } from '@google-cloud/cloud-sql-connector';
import mysql from 'mysql2/promise';

export type MySqlConfig =
  // Local development via Cloud SQL Auth Proxy
  | {
      connectionType: 'tcp';
      host: string;
      port: number;
      user: string;
      database: string;
    }
  // Production / Cloud Run via Cloud SQL Node.js Connector + IAM DB auth
  | {
      connectionType: 'cloud-sql-iam';
      instanceConnectionName: string;
      user: string;
      database: string;
    };

export const createMySqlClient = async (config: MySqlConfig) => {
  if (config.connectionType === 'cloud-sql-iam') {
    const connector = new Connector();

    const connectorOptions = await connector.getOptions({
      instanceConnectionName: config.instanceConnectionName,
      authType: AuthTypes.IAM,
    });

    return mysql.createPool({
      ...connectorOptions,
      user: config.user,
      database: config.database,
    });
  }

  return mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database,
  });
};
