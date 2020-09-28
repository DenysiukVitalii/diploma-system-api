import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Degree } from './degree.entity';
import { DegreeService } from './degree.service';
import { DegreeController } from './degree.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Degree])],
  controllers: [DegreeController],
  providers: [DegreeService],
})
export class DegreeModule {}
