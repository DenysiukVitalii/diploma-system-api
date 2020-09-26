import { ISendMailOptions } from '@nest-modules/mailer/dist/interfaces/send-mail-options.interface';

export type EmailMessage = EmailMessageDto | ISendMailOptions;
export interface EmailMessageDto {
  to: string;
  subject: string;
  template: string;
  context: EmailMessageContext;
}

export interface EmailMessageContext {
  [name: string]: any;
  controlCenterUrl?: string;
  time?: Date;
  version?: string;
}
