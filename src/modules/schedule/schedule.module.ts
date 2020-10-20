import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { Schedule } from './schedule.entity';
import { User } from '../users/user.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, User, AcademicDegree, AcademicYear]),
  ],
  providers: [ScheduleService],
  exports: [ScheduleService],
  controllers: [ScheduleController],
})
export class ScheduleModule {}
