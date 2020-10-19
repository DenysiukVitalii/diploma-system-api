import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ThemeService } from './theme.service';
import { ThemeController } from './theme.controller';
import { Theme } from './theme.entity';
import { AcademicDegree } from '../academicDegree/academicDegree.entity';
import { LaboratoryDirection } from '../laboratoryDirection/laboratoryDirection.entity';
import { AcademicYear } from '../academicYear/academicYear.entity';
import { Group } from '../group/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Theme,
      Group,
      AcademicDegree,
      AcademicYear,
      LaboratoryDirection,
    ]),
  ],
  providers: [ThemeService],
  exports: [ThemeService],
  controllers: [ThemeController],
})
export class ThemeModule {}
