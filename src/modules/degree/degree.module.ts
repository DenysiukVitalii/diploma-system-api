import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Degree } from './degree.entity';
import { Department } from '../department/department.entity';
import { DegreeService } from './degree.service';
import { DegreeController } from './degree.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Degree, Department, User])],
  controllers: [DegreeController],
  providers: [DegreeService],
})
export class DegreeModule {}
