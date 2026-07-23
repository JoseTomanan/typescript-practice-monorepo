import type { TodoStatusValue } from './constants/TodoStatusValues';

// Pure, Zod-free domain type. The `TodoStatusSchema` in api-contracts
// derives its literals from `STATUS_VALUES` and is checked against this
// type (see api-contracts/TodoStatusSchema.ts) so the two stay in sync
// without domain depending on the validation layer.
export type TodoStatus =
  | { status: Extract<TodoStatusValue, 'todo'> }
  | { status: Extract<TodoStatusValue, 'in-progress'> }
  | { status: Extract<TodoStatusValue, 'done'>; dateFinished?: Date };

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
