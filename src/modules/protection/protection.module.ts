import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProtectionService } from './protection.service';
import { ProtectionController } from './protection.controller';
import { Protection } from './protection.entity';
import { ProtectionType } from './protectionType.entity';
import { User } from 'modules/users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Protection, ProtectionType, User]),
  ],
  providers: [ProtectionService],
  exports: [ProtectionService],
  controllers: [ProtectionController],
})
export class ProtectionModule {}
