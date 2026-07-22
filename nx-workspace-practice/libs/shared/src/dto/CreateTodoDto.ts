import { z } from 'zod';
import { TodoStatusSchema } from '../../domain/TodoItem';

export const CreateTodoSchema = z.object({
  title: z.string().min(1, 'title is required'),
  description: z.string().optional(),
  deadline: z.coerce.date().optional(),
  status: TodoStatusSchema.optional(),
});

export type CreateTodoDto = z.infer<typeof CreateTodoSchema>;
