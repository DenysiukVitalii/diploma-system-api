import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Department } from 'modules/department/department.entity';
import { ApplicationMailerModule } from '../mailer/mailer.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Department]), ApplicationMailerModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
