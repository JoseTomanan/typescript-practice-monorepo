import { z } from 'zod';

// FIXME: this doesnt belong here
// go to /presentation
export const TodoStatusSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal('todo'), id: z.number().optional() }),
  z.object({ status: z.literal('in-progress'), id: z.number().optional() }),
  z.object({
    status: z.literal('done'),
    id: z.number().optional(),
    dateFinished: z.coerce.date().optional(),
  }),
]);

export type TodoStatus = z.infer<typeof TodoStatusSchema>;

export interface TodoItem {
  id?: number;
  status: TodoStatus;
  title: string;
  dateCreated: Date;
  description?: string;
  deadline?: Date;
}

export class TodoList<ID = number> {
  id?: ID;
  name = '';
  list: TodoItem[] = [];

  constructor(initializer?: Partial<TodoList<ID>>) {
    if (!initializer)
      return;

    this.id = initializer.id;
    this.name = initializer.name ? initializer.name : '';
    this.list = initializer.list ? initializer.list : [];
  }
}

export default TodoList;
