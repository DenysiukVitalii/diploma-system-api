import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AcademicYear } from './academicYear.entity';
import { AcademicYearService } from './academicYear.service';
import { AcademicYearController } from './academicYear.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AcademicYear])],
  controllers: [AcademicYearController],
  providers: [AcademicYearService],
})
export class AcademicYearModule {}
