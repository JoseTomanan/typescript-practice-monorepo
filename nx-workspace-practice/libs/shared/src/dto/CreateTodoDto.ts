import { TodoStatus } from '../types/TodoItem';

export interface CreateTodoDto {
  title: string;
  description?: string;
  deadline?: Date;
  status?: TodoStatus;
}