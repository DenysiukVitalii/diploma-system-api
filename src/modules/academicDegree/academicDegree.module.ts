import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicDegree } from './academicDegree.entity';
import { AcademicDegreeService } from './academicDegree.service';
import { AcademicDegreeController } from './academicDegree.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicDegree])],
  controllers: [AcademicDegreeController],
  providers: [AcademicDegreeService],
})
export class AcademicDegreeModule {}
