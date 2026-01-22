import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as path from 'path';
import { dump } from 'js-yaml';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Todos')
    .setDescription('The todos API description')
    .setVersion('1.0')
    .addTag('Todos')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documents', app, document, {
  jsonDocumentUrl: 'documents/json',
  });
  const outputPath = path.resolve(process.cwd(), 'openapi.yml');
  writeFileSync(outputPath, dump(document, {}));

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
