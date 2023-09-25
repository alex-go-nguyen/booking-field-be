import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

config();

const configService = new ConfigService();

let connectionOptions: PostgresConnectionOptions;

if (['staging', 'production'].includes(configService.get('NODE_ENV'))) {
  connectionOptions = {
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  };
} else {
  connectionOptions = {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: +configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
  };
}

export default {
  type: 'postgres',
  ...connectionOptions,
  entities: ['./src/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  seeders: ['./src/database/seeds/**/*{.ts,.js}'],
  migrations: ['./src/database/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: './src/database/migrations',
  },
  // extra: {
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
  // },
};
