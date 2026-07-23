import { Injectable } from '@nestjs/common';
import { TodoItem, TodoList, buildTodo, buildStatus } from 'todo-domain';
import { CreateTodoDto, UpdateTodoDto, UpdateTodoStatusDto } from 'api-contracts';
import { ITodosRepository } from './todos.repository';
import { TodoNotFoundError } from '../exceptions/todo-not-found.error';

@Injectable()
export class TodosService {
  constructor(private readonly repo: ITodosRepository) {}

  /**
   * GET /todos
   * Returns the complete todo list.
   */
  async getTodos(): Promise<TodoList> {
    const list = (await this.repo.findAll()).sort((a, b) => (a.id as number) - (b.id as number));

    return new TodoList({ id: 1, name: 'Default todo list', list });
  }

  /**
   * GET /todos/:id
   * Finds a single todo by identifier.
   */
  async getTodo(id: number): Promise<TodoItem> {
    return this.findTodo(id);
  }

  /**
   * POST /todos
   * Builds and stores a new todo item.
   */
  async createTodo(createTodoDto: CreateTodoDto): Promise<TodoItem> {
    const todo = buildTodo(createTodoDto, undefined, new Date());

    return this.repo.create(todo);
  }

  /**
   * PATCH /todos/:id
   * Updates an existing todo while preserving its identifier.
   */
  async updateTodo(id: number, updateTodoDto: UpdateTodoDto): Promise<TodoItem> {
    const todo = await this.findTodo(id);
    const updatedTodo = {
      ...todo,
      ...buildTodo(updateTodoDto, todo, new Date()),
      id: todo.id,
    };

    await this.repo.save(updatedTodo);

    return updatedTodo;
  }

  /**
   * PATCH /todos/:id/status
   * Updates only the status for an existing todo.
   */
  async updateTodoStatus(id: number, dto: UpdateTodoStatusDto): Promise<TodoItem> {
    const todo = await this.findTodo(id);
    const updatedTodo = {
      ...todo,
      status: buildStatus(dto.status, new Date()),
    };

    await this.repo.save(updatedTodo);

    return updatedTodo;
  }

  /**
   * DELETE /todos/:id
   * Removes a todo from the table and reports success.
   */
  async deleteTodo(id: number) {
    if (!(await this.repo.delete(id))) throw new TodoNotFoundError(id);

    return { deleted: true };
  }

  /** Looks up a todo or throws when it does not exist. */
  private async findTodo(id: number): Promise<TodoItem> {
    const todo = await this.repo.findById(id);

    if (!todo) throw new TodoNotFoundError(id);

    return todo;
  }
}
