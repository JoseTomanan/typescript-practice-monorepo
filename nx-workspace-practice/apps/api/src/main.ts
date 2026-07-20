import { BadRequestException, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createZodValidationPipe } from 'nestjs-zod';
import { z } from 'zod';
import { AppModule } from './app/app.module';

function createValidationException(error: unknown) {
  const issues = error instanceof z.ZodError ? error.issues : [];

  return new BadRequestException({
    message: 'Validation failed',
    errors: issues.map((issue) => ({
      path: issue.path.join('.') || '(root)',
      message: issue.message,
    })),
  });
}

const ZodValidationPipe = createZodValidationPipe({
  createValidationException,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ZodValidationPipe());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
