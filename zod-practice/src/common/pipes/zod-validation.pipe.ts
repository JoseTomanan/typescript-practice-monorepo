import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
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

  transform(value: unknown, _metadata: ArgumentMetadata) {
    // safeParse over parse: it lets us inspect the failure and reshape it into a
    // clean 400 body rather than leaking a raw thrown ZodError.
    const result = this.schema.safeParse(value);

    if (!result.success) {
      // Surface each issue as { path, message } — enough for a consumer to fix
      // the request, without dumping Zod's full internal issue format.
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    // Return the *parsed* value so Zod defaults (e.g. amenities -> []) are applied
    // before the handler/service runs.
    return result.data;
  }
}
