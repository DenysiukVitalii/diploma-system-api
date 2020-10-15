import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Request } from './request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request]),
  ],
  providers: [RequestService],
  exports: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
