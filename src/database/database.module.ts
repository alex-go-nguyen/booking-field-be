import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (['staging', 'production'].includes(configService.get('NODE_ENV'))) {
          return {
            type: 'postgres',
            url: configService.get('DATABASE_URL'),
            // ssl: {
            //   rejectUnauthorized: false,
            // },

            autoLoadEntities: true,
            synchronize: false,
            logging: true,
            migrationsRun: false,
            migrations: ['dist/src/database/migrations/**/*{.ts,.js}'],
          };
        }
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          logging: true,
          migrationsRun: false,
          migrations: ['dist/src/database/migrations/**/*{.ts,.js}'],
        };
      },
    }),
  ],
})
export class DatabaseModule {}
