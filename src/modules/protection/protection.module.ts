import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProtectionService } from './protection.service';
import { ProtectionController } from './protection.controller';
import { Protection } from './protection.entity';
import { ProtectionType } from './protectionType.entity';
import { User } from 'modules/users/user.entity';
import { Comission } from './comission.entity';
import { StudentProtection } from './studentProtection.entity';
import { Group } from 'modules/group/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Protection, ProtectionType, Comission, StudentProtection, User, Group]),
  ],
  providers: [ProtectionService],
  exports: [ProtectionService],
  controllers: [ProtectionController],
})
export class ProtectionModule {}
