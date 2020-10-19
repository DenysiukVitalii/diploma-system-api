import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Request } from './request.entity';
import { User } from '../users/user.entity';
import { Theme } from '../theme/theme.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, User, Theme]),
  ],
  providers: [RequestService],
  exports: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
