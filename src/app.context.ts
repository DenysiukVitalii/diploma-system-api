import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exceptions/http-exception.filter';
import { ValidationPipe } from './common/pipes/validation.pipe';
// import './drive/index';

let app;
export const ApplicationContext = async () => {
  if (!app) {
    app = await NestFactory.create(AppModule);
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors({
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      origin: ['http://localhost:4000', 'https://diploma-system-app.herokuapp.com'],
    });

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
