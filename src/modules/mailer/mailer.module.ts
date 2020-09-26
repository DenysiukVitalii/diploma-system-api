import { Module } from '@nestjs/common';
import { MailerModule } from '@nest-modules/mailer';

import { ApplicationMailerService } from './mailer.service';
import { ConfigService } from '../../config/config.service';
import { ConfigModule } from '../../config/config.module';

@Module({
  imports: [
    ConfigModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) =>
        configService.getMailerConfiguration(),
      inject: [ConfigService],
    }),
  ],
  providers: [ApplicationMailerService],
  exports: [ApplicationMailerService],
})
export class ApplicationMailerModule {}
