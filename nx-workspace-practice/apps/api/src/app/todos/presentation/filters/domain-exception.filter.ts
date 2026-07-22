import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { TodoNotFoundError } from '../../exceptions/todo-not-found.error';

/**
 * Maps framework-agnostic domain errors to HTTP responses.
 *
 * `TodoNotFoundError` is deliberately rebuilt through NestJS's own
 * `NotFoundException` rather than hand-rolling `{ error: 'TodoNotFoundError' }`
 * (the template's `constructor.name` convention) — the 404 wire format is
 * pinned by characterization e2e tests and must stay byte-identical to what
 * `TodosService` used to throw directly.
 */
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof TodoNotFoundError) {
      const httpException = new NotFoundException(exception.message);
      response.status(httpException.getStatus()).json(httpException.getResponse());
      return;
    }

    // Covers NestJS's own exceptions (e.g. the Zod BadRequestException from main.ts) —
    // pass the response body through unchanged.
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      response.status(status).json(body);
      return;
    }

    const message = exception instanceof Error ? exception.message : String(exception);
    const error = exception instanceof Error ? exception.constructor.name : 'UnknownError';

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message,
      error,
    });
  }
}
