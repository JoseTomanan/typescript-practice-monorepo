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
  /** Stores the in-memory todo list returned by the API. */
  private readonly todoList = new TodoList({
    id: 1,
    name: 'Default todo list',
    list: [],
  });

  /** Tracks the next todo identifier to assign. */
  private nextId = 1;

  /** Returns the complete todo list. */
  getTodos() {
    return this.todoList;
  }

  /** Finds a single todo by identifier. */
  getTodo(id: number): TodoItem {
    return this.findTodo(id);
  }

  /** Builds and stores a new todo item. */
  createTodo(createTodoDto: CreateTodoDto): TodoItem {
    const todo = this.buildTodo(createTodoDto);
    this.todoList.list.push(todo);

    return todo;
  }

  /** Updates an existing todo while preserving its identifier. */
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

  /** Updates only the status for an existing todo. */
  updateTodoStatus(id: number, dto: UpdateTodoStatusDto): TodoItem {
    const todo = this.findTodo(id);
    const updatedTodo = {
      ...todo,
      status: this.buildStatus(dto.status),
    };

    this.replaceTodo(id, updatedTodo);

    return updatedTodo;
  }

  /** Removes a todo from the list and reports success. */
  deleteTodo(id: number) {
    const todoIndex = this.todoList.list.findIndex((todo) => todo.id === id);

    if (todoIndex === -1)
      throw new NotFoundException(`Todo ${id} not found`);

    this.todoList.list.splice(todoIndex, 1);

    return { deleted: true };
  }

  /** Looks up a todo or throws when it does not exist. */
  private findTodo(id: number): TodoItem {
    const todo = this.todoList.list.find((item) => item.id === id);

    if (!todo)
      throw new NotFoundException(`Todo ${id} not found`);

    return todo;
  }

  /** Replaces an existing todo at the same list position. */
  private replaceTodo(id: number, todo: TodoItem) {
    const todoIndex = this.todoList.list.findIndex((item) => item.id === id);

    if (todoIndex === -1) {
      throw new NotFoundException(`Todo ${id} not found`);
    }

    this.todoList.list.splice(todoIndex, 1, todo);
  }

  /** Creates a todo payload from request data and optional existing state. */
  private buildTodo(
    todoDto: CreateTodoDto | UpdateTodoDto,
    existingTodo?: TodoItem,
  ): TodoItem {
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

  /** Normalizes todo status and stamps completion time for done items. */
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
