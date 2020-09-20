import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

let app;
export const ApplicationContext = async () => {
  if (!app) {
    app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
      .setTitle('Diploma API')
      .setDescription('This page provides Diploma API v1 documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
  }
  return app;
};
