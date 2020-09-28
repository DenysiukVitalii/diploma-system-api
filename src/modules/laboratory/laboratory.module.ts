import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Laboratory } from './laboratory.entity';
import { LaboratoryService } from './laboratory.service';
import { LaboratoryController } from './laboratory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Laboratory])],
  controllers: [LaboratoryController],
  providers: [LaboratoryService],
})
export class LaboratoryModule {}
