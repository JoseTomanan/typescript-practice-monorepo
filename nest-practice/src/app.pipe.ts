import { createZodValidationPipe } from 'nestjs-zod';

export const ZodValidationPipe: ReturnType<typeof createZodValidationPipe> = createZodValidationPipe({
  strictSchemaDeclaration: true,
});
