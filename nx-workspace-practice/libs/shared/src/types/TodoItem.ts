interface BaseStatus {
  id?: number;
}

interface StatusTodo extends BaseStatus {
  status: 'todo';
}

interface StatusInProgress extends BaseStatus {
  status: 'in-progress';
}

interface StatusDone extends BaseStatus {
  status: 'done';
  dateFinished?: Date;
}

export type TodoStatus = StatusTodo | StatusInProgress | StatusDone;

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
