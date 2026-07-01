import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

/**
 * Generic NestJS pipe that validates a request payload against a Zod schema
 * instead of class-validator decorators. Use it per-route:
 *
 *   @UsePipes(new ZodValidationPipe(createBuildingSchema))
 *   @Post()
 *   create(@Body() dto: CreateBuildingDto) { ... }
 */
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(_value: unknown, _metadata: ArgumentMetadata) {
    // TODO(you): validate `_value` against `this.schema`.
    //
    // Design choices to make:
    // - Zod's `.safeParse()` lets you inspect success/failure without a try/catch;
    //   `.parse()` throws a ZodError directly. Either is fine — pick one and be consistent.
    // - On failure, throw a `BadRequestException` (import it from '@nestjs/common';
    //   maps to HTTP 400).
    //   Decide how much of the ZodError to surface in the response body — the full
    //   `error.issues` array (path + message per field) is the most useful for API
    //   consumers, but you may want to reshape it rather than dump Zod's raw format.
    // - On success, return the *parsed* value (not the original `value`) so that
    //   Zod defaults (e.g. `amenities` defaulting to `[]`) are applied downstream.
    throw new Error('ZodValidationPipe.transform() not implemented yet');
  }
}
