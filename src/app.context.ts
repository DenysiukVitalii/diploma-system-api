import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';

let app;
export const ApplicationContext = async () => {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());

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
