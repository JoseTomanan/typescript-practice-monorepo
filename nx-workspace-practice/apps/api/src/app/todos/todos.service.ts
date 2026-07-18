import { Injectable, NotFoundException } from '@nestjs/common';
import {
  TodoItem,
  TodoList,
  TodoStatus,
  CreateTodoDto,
  UpdateTodoDto,
  UpdateTodoStatusDto,
} from 'shared';

@Injectable()
export class TodosService {
  private readonly todoList = new TodoList({
    id: 1,
    name: 'Default todo list',
    list: [],
  });

  private nextId = 1;

  getTodos() {
    return this.todoList;
  }

  getTodo(id: number): TodoItem {
    return this.findTodo(id);
  }

  createTodo(createTodoDto: CreateTodoDto): TodoItem {
    const todo = this.buildTodo(createTodoDto);
    this.todoList.list.push(todo);

    return todo;
  }

  updateTodo(id: number, updateTodoDto: UpdateTodoDto): TodoItem {
    const todo = this.findTodo(id);
    const updatedTodo = {
      ...todo,
      ...this.buildTodo(updateTodoDto, todo),
      id: todo.id,
    };

    this.replaceTodo(id, updatedTodo);

    return updatedTodo;
  }

  updateTodoStatus(id: number, dto: UpdateTodoStatusDto): TodoItem {
    const todo = this.findTodo(id);
    const updatedTodo = {
      ...todo,
      status: this.buildStatus(dto.status),
    };

    this.replaceTodo(id, updatedTodo);

    return updatedTodo;
  }

  deleteTodo(id: number) {
    const todoIndex = this.todoList.list.findIndex((todo) => todo.id === id);

    if (todoIndex === -1)
      throw new NotFoundException(`Todo ${id} not found`);

    this.todoList.list.splice(todoIndex, 1);

    return { deleted: true };
  }

  private findTodo(id: number): TodoItem {
    const todo = this.todoList.list.find((item) => item.id === id);

    if (!todo)
      throw new NotFoundException(`Todo ${id} not found`);

    return todo;
  }

  private replaceTodo(id: number, todo: TodoItem) {
    const todoIndex = this.todoList.list.findIndex((item) => item.id === id);

    if (todoIndex === -1) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    this.todoList.list.splice(todoIndex, 1, todo);
  }

  private buildTodo(todoDto: CreateTodoDto | UpdateTodoDto, existingTodo?: TodoItem,): TodoItem {
    const statusValue: TodoStatus = todoDto.status ?? existingTodo?.status ?? { status: 'todo' };

    const newStatus = this.buildStatus(statusValue);
    
    return {
      id: existingTodo?.id ?? this.nextId++,
      title: todoDto.title ?? existingTodo?.title ?? '',
      description: todoDto.description ?? existingTodo?.description,
      deadline: todoDto.deadline ?? existingTodo?.deadline,
      dateCreated: existingTodo?.dateCreated ?? new Date(),
      status: newStatus,
    };
  }

  private buildStatus(status: TodoStatus): TodoItem['status'] {
    if (status.status === 'done') {
      return {
        status: status.status,
        dateFinished: new Date(),
      };
    }

    return { status: status.status };
  }
}
