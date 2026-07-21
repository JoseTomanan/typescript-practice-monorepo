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
  //
  // These mutation endpoints are unauthenticated, so a bare `enableCors()`
  // (any origin) would let any website drive them from a victim's browser.
  // Restrict to the trusted web-app origin instead; override via WEB_ORIGIN
  // when the app is served from somewhere other than local dev.
  app.enableCors({
    origin: process.env.WEB_ORIGIN ?? 'http://localhost:3001',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`);
}

bootstrap();
