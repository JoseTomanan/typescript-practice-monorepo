import { createZodDto } from 'nestjs-zod';
import { CreateTodoSchema, UpdateTodoSchema, UpdateTodoStatusSchema } from 'api-contracts';

/**
 * API-layer DTO classes built from the framework-agnostic Zod schemas in
 * `shared`. These give Nest a class to bind `@Body()` to while the actual
 * validation is performed by the global `nestjs-zod` pipe registered in
 * main.ts.
 */
export class CreateTodoDto extends createZodDto(CreateTodoSchema) {}
export class UpdateTodoDto extends createZodDto(UpdateTodoSchema) {}
export class UpdateTodoStatusDto extends createZodDto(UpdateTodoStatusSchema) {}
