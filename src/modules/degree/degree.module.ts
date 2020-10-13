import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Degree } from './degree.entity';
import { Department } from '../department/department.entity';
import { DegreeService } from './degree.service';
import { DegreeController } from './degree.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Degree, Department])],
  controllers: [DegreeController],
  providers: [DegreeService],
})
export class DegreeModule {}
