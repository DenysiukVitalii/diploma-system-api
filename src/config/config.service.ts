import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { MailerOptions, HandlebarsAdapter } from '@nest-modules/mailer';
import { join } from 'path';

import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;
  static readonly ROOT_PATH: string = process.cwd();

  constructor() {
    const { parsed } = dotenv.config();
    this.envConfig = parsed;
  }

  get(key: string): string {
    return process.env[key] || this.envConfig[key];
  }

  getDatabaseConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.get('DB_HOST'),
      port: Number(this.get('DB_PORT')),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_NAME'),
      autoLoadEntities: true,
      synchronize: true,
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  getGoogleDriveConfig() {
    return {
      web: {
        client_id: this.get('GD_CLIENT_ID'),
        project_id: this.get('GD_PROJECT_ID'),
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_secret: this.get('GD_CLIENT_SECRET'),
        redirect_uris: ['https://diploma-system-api.herokuapp.com/docs'],
      },
    };
  }

  getMailerConfiguration(): MailerOptions {
    const mailerConfig = {
      transport: {
        host: this.get('MAILER_SMTP_HOST'),
        port: Number(this.get('MAILER_SMTP_PORT')),
      },
      defaults: {
        from: this.get('MAILER_SMTP_EMAIL_FROM'),
      },
      template: {
        dir: join(
          ConfigService.ROOT_PATH,
          this.get('MAILER_SMTP_TEMPLATES_PATH'),
        ),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
    if (this.get('MAILER_SMTP_USER') && this.get('MAILER_SMTP_PASSWORD')) {
      mailerConfig.transport['auth'] = {
        user: this.get('MAILER_SMTP_USER'),
        pass: this.get('MAILER_SMTP_PASSWORD'),
      };
    }

    return mailerConfig;
  }
}
