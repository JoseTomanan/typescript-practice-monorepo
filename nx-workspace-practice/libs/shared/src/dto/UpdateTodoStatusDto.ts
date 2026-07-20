import { z } from 'zod';
import { TodoStatusSchema } from '../types/TodoItem';

export const UpdateTodoStatusSchema = z.object({
  status: TodoStatusSchema,
});

export type UpdateTodoStatusDto = z.infer<typeof UpdateTodoStatusSchema>;
