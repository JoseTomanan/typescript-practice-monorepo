import { TodoItem } from '../types/TodoItem';

export interface CreateTodoDto {
  title: string;
  description?: string;
  deadline?: Date;
  status?: TodoItem['status'];
}