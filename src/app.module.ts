import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';

const DB_OPTIONS: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DB_URL,
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false
  }
};

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_OPTIONS),
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
