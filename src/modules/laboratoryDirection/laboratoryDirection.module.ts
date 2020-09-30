import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LaboratoryDirection } from './laboratoryDirection.entity';
import { LaboratoryDirectionService } from './laboratoryDirection.service';
import { LaboratoryDirectionController } from './laboratoryDirection.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LaboratoryDirection])],
  controllers: [LaboratoryDirectionController],
  providers: [LaboratoryDirectionService],
})
export class LaboratoryDirectionModule {}
