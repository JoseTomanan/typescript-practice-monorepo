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
    list: [
      {
        id: 1,
        title: 'Teach the office plant to file its own expense reports',
        description: 'It keeps submitting receipts for sunlight.',
        status: { status: 'in-progress' },
        dateCreated: new Date('2026-07-01'),
        deadline: new Date('2026-08-15'),
      },
      {
        id: 2,
        title: 'Negotiate a ceasefire between the printer and the stapler',
        description: 'Tensions escalated after the Great Paper Jam of Tuesday.',
        status: { status: 'todo' },
        dateCreated: new Date('2026-07-05'),
        deadline: new Date('2026-07-31'),
      },
      {
        id: 3,
        title: 'Alphabetize the ocean',
        status: { status: 'todo' },
        dateCreated: new Date('2026-07-10'),
      },
      {
        id: 4,
        title: 'Return the borrowed thunderstorm to the neighbors',
        description: 'They noticed. It was raining indoors again.',
        status: { status: 'done', dateFinished: new Date('2026-07-18') },
        dateCreated: new Date('2026-06-20'),
      },
    ],
  });

  /**
   * GET /todos
   * Returns the complete todo list.
   */
  getTodos() {
    return this.todoList;
  }

  /**
   * GET /todos/:id
   * Finds a single todo by identifier.
   */
  getTodo(id: number): TodoItem {
    return this.findTodo(id);
  }

  /**
   * POST /todos
   * Builds and stores a new todo item.
   */
  createTodo(createTodoDto: CreateTodoDto): TodoItem {
    const todo = this.buildTodo(createTodoDto);
    this.todoList.list.push(todo);

    return todo;
  }

  /**
   * PATCH /todos/:id
   * Updates an existing todo while preserving its identifier.
   */
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

  /**
   * PATCH /todos/:id/status
   * Updates only the status for an existing todo.
   */
  updateTodoStatus(id: number, dto: UpdateTodoStatusDto): TodoItem {
    const todo = this.findTodo(id);
    const updatedTodo = {
      ...todo,
      status: this.buildStatus(dto.status),
    };

    this.replaceTodo(id, updatedTodo);

    return updatedTodo;
  }

  /**
   * DELETE /todos/:id
   * Removes a todo from the list and reports success.
   */
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
      id: existingTodo?.id ?? this.getNextId(),
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

  /** Derives the next todo identifier from the current list of IDs. */
  private getNextId(): number {
    const highestId = this.todoList.list.reduce((maxId, todo) => {
      return Math.max(maxId, todo.id);
    }, 0);

    return highestId + 1;
  }
}
