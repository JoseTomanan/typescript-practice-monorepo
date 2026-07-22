import { Inject, Injectable } from '@nestjs/common';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { TodoItem, TodoStatus } from 'shared';
import { ITodosRepository } from '../../application/todos.repository';
import { DYNAMODB_CLIENT } from '../../todos.constants';
import { COUNTER_SK, TODOS_TABLE_NAME, TODO_LIST_PK, todoSortKey } from '../todos.keys';

/** Converts a TodoItem into the shape stored in DynamoDB (dates as ISO strings). */
export function toItem(todo: TodoItem) {
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
export function fromItem(item: Record<string, unknown>): TodoItem {
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

@Injectable()
export class DynamoTodosRepository extends ITodosRepository {
  constructor(@Inject(DYNAMODB_CLIENT) private readonly docClient: DynamoDBDocumentClient) {
    super();
  }

  async findAll(): Promise<TodoItem[]> {
    const result = await this.docClient.send(
      new QueryCommand({
        TableName: TODOS_TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
        ExpressionAttributeValues: { ':pk': TODO_LIST_PK, ':prefix': 'TODO#' },
      }),
    );

    return (result.Items ?? []).map(fromItem);
  }

  async findById(id: number): Promise<TodoItem | null> {
    const result = await this.docClient.send(
      new GetCommand({
        TableName: TODOS_TABLE_NAME,
        Key: { pk: TODO_LIST_PK, sk: todoSortKey(id) },
      }),
    );

    return result.Item ? fromItem(result.Item) : null;
  }

  async create(todo: TodoItem): Promise<TodoItem> {
    const stored = { ...todo, id: await this.nextId() };

    await this.docClient.send(
      new PutCommand({ TableName: TODOS_TABLE_NAME, Item: toItem(stored) }),
    );

    return stored;
  }

  async save(todo: TodoItem): Promise<void> {
    await this.docClient.send(
      new PutCommand({ TableName: TODOS_TABLE_NAME, Item: toItem(todo) }),
    );
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.docClient.send(
      new DeleteCommand({
        TableName: TODOS_TABLE_NAME,
        Key: { pk: TODO_LIST_PK, sk: todoSortKey(id) },
        ReturnValues: 'ALL_OLD',
      }),
    );

    return !!result.Attributes;
  }

  /**
   * Atomically claims the next todo id via a server-side DynamoDB increment
   * (`ADD`), so concurrent create() calls can't read the same value and hand
   * out duplicate ids the way a read-then-write would.
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
}
