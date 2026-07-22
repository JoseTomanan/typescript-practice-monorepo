import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import { TodosService } from './todos.service';
import { TodoNotFoundError } from './exceptions/todo-not-found.error';

// Intercepts every `.send()` call made through any DynamoDBDocumentClient
// instance, so tests never touch a real DynamoDB (Local or otherwise).
const ddbMock = mockClient(DynamoDBDocumentClient);

// Shape a todo takes once stored (dates as ISO strings, pk/sk attached) —
// matches TodosService's private toItem()/fromItem() mapping.
function storedItem(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    pk: 'TODOLIST#1',
    sk: 'TODO#1',
    id: 1,
    title: 'Existing',
    dateCreated: '2026-07-01T00:00:00.000Z',
    status: { status: 'todo' },
    ...overrides,
  };
}

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(() => {
    ddbMock.reset();
    service = new TodosService(DynamoDBDocumentClient.from(new DynamoDBClient({})));
  });

  describe('getTodos', () => {
    it('queries the table and maps items into a TodoList', async () => {
      ddbMock.on(QueryCommand).resolves({ Items: [storedItem()] });

      const todos = await service.getTodos();

      expect(todos.id).toBe(1);
      expect(todos.list).toHaveLength(1);
      expect(todos.list[0]).toMatchObject({ id: 1, title: 'Existing' });
      expect(todos.list[0].dateCreated).toBeInstanceOf(Date);
    });
  });

  describe('createTodo', () => {
    beforeEach(() => {
      ddbMock.on(UpdateCommand).resolves({ Attributes: { currentId: 5 } });
      ddbMock.on(PutCommand).resolves({});
    });

    it('creates a todo with the given title and stores it', async () => {
      const created = await service.createTodo({ title: 'First' });

      expect(created.title).toBe('First');
      expect(created.id).toBe(5);
    });

    it('assigns the id claimed from the atomic counter', async () => {
      const created = await service.createTodo({ title: 'A' });

      expect(created.id).toBe(5);
    });

    it('defaults the status to "todo" and stamps dateCreated', async () => {
      const created = await service.createTodo({ title: 'Defaults' });

      expect(created.status).toEqual({ status: 'todo' });
      expect(created.dateCreated).toBeInstanceOf(Date);
    });
  });

  describe('getTodo', () => {
    it('returns the matching todo', async () => {
      ddbMock.on(GetCommand).resolves({ Item: storedItem() });

      const todo = await service.getTodo(1);

      expect(todo.id).toBe(1);
      expect(todo.title).toBe('Existing');
    });

    it('throws TodoNotFoundError for an unknown id', async () => {
      ddbMock.on(GetCommand).resolves({});

      await expect(service.getTodo(999)).rejects.toThrow(TodoNotFoundError);
    });
  });

  describe('updateTodo', () => {
    it('updates fields while preserving the id', async () => {
      ddbMock.on(GetCommand).resolves({ Item: storedItem() });
      ddbMock.on(PutCommand).resolves({});

      const updated = await service.updateTodo(1, {
        title: 'New',
        description: 'desc',
      });

      expect(updated.id).toBe(1);
      expect(updated.title).toBe('New');
      expect(updated.description).toBe('desc');
    });

    it('throws TodoNotFoundError for an unknown id', async () => {
      ddbMock.on(GetCommand).resolves({});

      await expect(service.updateTodo(999, { title: 'X' })).rejects.toThrow(TodoNotFoundError);
    });
  });

  describe('updateTodoStatus', () => {
    it('stamps dateFinished when moving to done', async () => {
      ddbMock.on(GetCommand).resolves({ Item: storedItem() });
      ddbMock.on(PutCommand).resolves({});

      const updated = await service.updateTodoStatus(1, { status: { status: 'done' } });

      expect(updated.status.status).toBe('done');
      if (updated.status.status === 'done') {
        expect(updated.status.dateFinished).toBeInstanceOf(Date);
      }
    });

    it('does not stamp dateFinished for non-done statuses', async () => {
      ddbMock.on(GetCommand).resolves({ Item: storedItem() });
      ddbMock.on(PutCommand).resolves({});

      const updated = await service.updateTodoStatus(1, {
        status: { status: 'in-progress' },
      });

      expect(updated.status).toEqual({ status: 'in-progress' });
    });
  });

  describe('deleteTodo', () => {
    it('removes the todo and reports success', async () => {
      ddbMock.on(DeleteCommand).resolves({ Attributes: storedItem() });

      await expect(service.deleteTodo(1)).resolves.toEqual({ deleted: true });
    });

    it('throws TodoNotFoundError for an unknown id', async () => {
      ddbMock.on(DeleteCommand).resolves({});

      await expect(service.deleteTodo(999)).rejects.toThrow(TodoNotFoundError);
    });
  });
});
