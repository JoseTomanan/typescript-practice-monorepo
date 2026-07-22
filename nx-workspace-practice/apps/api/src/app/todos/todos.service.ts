import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import {
  TodoItem,
  TodoList,
  TodoStatus,
  CreateTodoDto,
  UpdateTodoDto,
  UpdateTodoStatusDto,
  buildTodo,
  buildStatus,
} from 'shared';
import {
  COUNTER_SK,
  DYNAMODB_CLIENT,
  TODOS_TABLE_NAME,
  TODO_LIST_PK,
  todoSortKey,
} from './todos.constants';
import { TodoNotFoundError } from './exceptions/todo-not-found.error';

@Injectable()
export class TodosService {
  constructor(@Inject(DYNAMODB_CLIENT) private readonly docClient: DynamoDBDocumentClient) {}

  /**
   * GET /todos
   * Returns the complete todo list.
   */
  async getTodos(): Promise<TodoList> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: TODOS_TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
        ExpressionAttributeValues: { ':pk': TODO_LIST_PK, ':prefix': 'TODO#' },
      }),
    );

    const list = (result.Items ?? [])
      .map((item) => this.fromItem(item))
      .sort((a, b) => (a.id as number) - (b.id as number));

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
    const id = await this.nextId();
    const todo = buildTodo(createTodoDto, undefined, new Date(), id);

    await this.docClient.send(
      new PutCommand({ TableName: TODOS_TABLE_NAME, Item: this.toItem(todo) }),
    );

    return todo;
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

    await this.docClient.send(
      new PutCommand({ TableName: TODOS_TABLE_NAME, Item: this.toItem(updatedTodo) }),
    );

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

    await this.docClient.send(
      new PutCommand({ TableName: TODOS_TABLE_NAME, Item: this.toItem(updatedTodo) }),
    );

    return updatedTodo;
  }

  /**
   * DELETE /todos/:id
   * Removes a todo from the table and reports success.
   */
  async deleteTodo(id: number) {
    const result = await this.docClient.send(
      new DeleteCommand({
        TableName: TODOS_TABLE_NAME,
        Key: { pk: TODO_LIST_PK, sk: todoSortKey(id) },
        ReturnValues: 'ALL_OLD',
      }),
    );

    if (!result.Attributes) throw new TodoNotFoundError(id);

    return { deleted: true };
  }

  /** Looks up a todo or throws when it does not exist. */
  private async findTodo(id: number): Promise<TodoItem> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TODOS_TABLE_NAME,
        Key: { pk: TODO_LIST_PK, sk: todoSortKey(id) },
      }),
    );

    if (!result.Item) throw new TodoNotFoundError(id);

    return this.fromItem(result.Item);
  }

  /**
   * Atomically claims the next todo id via a server-side DynamoDB increment
   * (`ADD`), so concurrent createTodo() calls can't read the same value and
   * hand out duplicate ids the way a read-then-write would.
   */
  private async nextId(): Promise<number> {
    const result = await this.docClient.send(
      new UpdateCommand({
        TableName: TODOS_TABLE_NAME,
        Key: { pk: TODO_LIST_PK, sk: COUNTER_SK },
        UpdateExpression: 'ADD currentId :incr',
        ExpressionAttributeValues: { ':incr': 1 },
        ReturnValues: 'UPDATED_NEW',
      }),
    );

    return result.Attributes?.currentId as number;
  }

  /** Converts a TodoItem into the shape stored in DynamoDB (dates as ISO strings). */
  private toItem(todo: TodoItem) {
    return {
      pk: TODO_LIST_PK,
      sk: todoSortKey(todo.id as number),
      id: todo.id,
      title: todo.title,
      description: todo.description,
      dateCreated: todo.dateCreated.toISOString(),
      deadline: todo.deadline?.toISOString(),
      status:
        todo.status.status === 'done'
          ? { status: todo.status.status, dateFinished: todo.status.dateFinished?.toISOString() }
          : { status: todo.status.status },
    };
  }

  /** Converts a stored DynamoDB item back into a TodoItem (ISO strings as dates). */
  private fromItem(item: Record<string, unknown>): TodoItem {
    const status = item.status as { status: TodoStatus['status']; dateFinished?: string };

    return {
      id: item.id as number,
      title: item.title as string,
      description: item.description as string | undefined,
      dateCreated: new Date(item.dateCreated as string),
      deadline: item.deadline ? new Date(item.deadline as string) : undefined,
      status:
        status.status === 'done'
          ? {
              status: status.status,
              dateFinished: status.dateFinished ? new Date(status.dateFinished) : undefined,
            }
          : { status: status.status },
    };
  }
}
