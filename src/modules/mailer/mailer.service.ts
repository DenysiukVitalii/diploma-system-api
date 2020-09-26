import { Injectable } from '@nestjs/common';
import { MailerService } from '@nest-modules/mailer';
import { MessageType, MessageTypes } from './constants/mailer.constants';
import { EmailMessage, EmailMessageContext } from './dto/email.message.dto';

@Injectable()
export class ApplicationMailerService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(
    mailTo: string,
    type: MessageType,
    context: EmailMessageContext,
  ): Promise<void> {
    const { subject, template } = MessageTypes[type];

    return this.mailerService.sendMail({ to: mailTo, subject, template, context });
  }
}
