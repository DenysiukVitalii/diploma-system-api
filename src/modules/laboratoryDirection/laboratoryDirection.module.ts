import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Laboratory } from '../laboratory/laboratory.entity';
import { LaboratoryDirection } from './laboratoryDirection.entity';
import { LaboratoryDirectionService } from './laboratoryDirection.service';
import { LaboratoryDirectionController } from './laboratoryDirection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LaboratoryDirection, Laboratory])],
  controllers: [LaboratoryDirectionController],
  providers: [LaboratoryDirectionService],
})
export class LaboratoryDirectionModule {}
