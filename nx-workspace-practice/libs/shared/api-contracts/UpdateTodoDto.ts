import { z } from 'zod';
import { CreateTodoSchema } from './CreateTodoDto';

export const UpdateTodoSchema = CreateTodoSchema.partial();

export type UpdateTodoDto = z.infer<typeof UpdateTodoSchema>;
