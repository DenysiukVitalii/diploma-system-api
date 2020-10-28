import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SpecialtyService } from './specialty.service';
import { SpecialtyController } from './specialty.controller';
import { Specialty } from './specialty.entity';
import { User } from '../users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specialty, User]),
  ],
  providers: [SpecialtyService],
  exports: [SpecialtyService],
  controllers: [SpecialtyController],
})
export class SpecialtyModule {}
