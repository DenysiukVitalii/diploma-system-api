import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TeacherLoad } from './teacherLoad.entity';
import { Department } from '../department/department.entity';
import { User } from '../users/user.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { TeacherLoadService } from './teacherLoad.service';
import { TeacherLoadController } from './teacherLoad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([
    TeacherLoad, Department, User, AcademicYear, AcademicDegree,
  ])],
  controllers: [TeacherLoadController],
  providers: [TeacherLoadService],
})
export class TeacherLoadModule {}
