import {
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VariablesModule } from './configs';
import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(
      AppModule,
    );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app
    .enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    })
    .setGlobalPrefix(
      VariablesModule.variables.api_prefix ||
        '/api/v1',
    );

  const config = new DocumentBuilder()
    .setTitle('SBrain Exercice Task Manager')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('Task Manager Api')
    .addSecurity('bearer', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  SwaggerModule.setup(
    `${VariablesModule.variables.api_prefix}/:version/docs`,
    app,
    document,
  );

  /* Begin template engine configuration */
  app.setBaseViewsDir(
    join(__dirname, '..', 'views'),
  );

  app.setViewEngine('ejs');
  /* End template engine configuration */

  await app.listen(
    VariablesModule.variables.port_domaine ||
      5000,
  );
}
bootstrap();
