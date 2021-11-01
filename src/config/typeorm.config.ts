import { TypeOrmModuleOptions } from '@nestjs/typeorm';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
