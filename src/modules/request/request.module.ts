import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { Request } from './request.entity';
import { User } from '../users/user.entity';
import { Theme } from '../theme/theme.entity';
import { ApplicationMailerModule } from '../mailer/mailer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Request, User, Theme, User]),
    ApplicationMailerModule,
  ],
  providers: [RequestService],
  exports: [RequestService],
  controllers: [RequestController],
})
export class RequestModule {}
