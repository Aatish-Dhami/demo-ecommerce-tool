import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const databaseUrl = process.env.DATABASE_URL || 'sqlite:./data/events.db';

  // Parse DATABASE_URL format: sqlite:./path/to/db.db
  let databasePath: string;
  if (databaseUrl.startsWith('sqlite:')) {
    databasePath = databaseUrl.replace('sqlite:', '');
  } else {
    databasePath = databaseUrl;
  }

  // Resolve relative paths from the backend package root
  if (!path.isAbsolute(databasePath)) {
    databasePath = path.resolve(__dirname, '../../', databasePath);
  }

  const isProduction = process.env.NODE_ENV === 'production';

  return {
    type: 'better-sqlite3',
    database: databasePath,
    synchronize: !isProduction,
    logging: !isProduction,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  };
};
