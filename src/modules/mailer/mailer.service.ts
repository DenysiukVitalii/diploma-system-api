import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { MessageType, MessageTypes } from './constants/mailer.constants';
import { EmailMessage, EmailMessageContext } from './dto/email.message.dto';
import { ConfigService } from 'config/config.service';

@Injectable()
export class ApplicationMailerService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(
    mailTo: string,
    type: MessageType,
    context: EmailMessageContext,
  ): Promise<void> {
    const { subject, template } = MessageTypes[type];
    const { from } = this.configService.getMailerConfiguration().defaults;

    return this.mailerService.sendMail({ to: mailTo, from, subject, template, context });
  }
}
