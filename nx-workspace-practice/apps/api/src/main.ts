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

  // The web app (:3001) calls this API (:3000) from the browser, so the
  // browser blocks those cross-origin requests unless CORS is enabled here.
  // Without this, every client-side mutation (add/edit/status/delete) fails.
  // TODO(policy): decide how open this should be. `app.enableCors()` allows
  // any origin (convenient for local dev); restrict it for anything shared,
  // e.g. `app.enableCors({ origin: 'http://localhost:3001' })`.
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
