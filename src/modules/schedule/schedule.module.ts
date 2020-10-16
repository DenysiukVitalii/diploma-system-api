import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { Schedule } from './schedule.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, User]),
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
