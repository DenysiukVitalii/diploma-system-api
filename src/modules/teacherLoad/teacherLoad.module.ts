import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeacherLoad } from './teacherLoad.entity';
import { Department } from '../department/department.entity';
import { TeacherLoadService } from './teacherLoad.service';
import { TeacherLoadController } from './teacherLoad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherLoad, Department])],
  controllers: [TeacherLoadController],
  providers: [TeacherLoadService],
})
export class TeacherLoadModule {}
