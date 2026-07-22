import { TodoItem } from 'shared';
import { DynamoTodosRepository, fromItem, toItem } from './dynamo-todos.repository';

describe('toItem / fromItem', () => {
  it('round-trips a todo with all fields set', () => {
    const todo: TodoItem = {
      id: 1,
      title: 'Existing',
      description: 'desc',
      dateCreated: new Date('2026-07-01T00:00:00.000Z'),
      deadline: new Date('2026-08-15T00:00:00.000Z'),
      status: { status: 'done', dateFinished: new Date('2026-07-20T00:00:00.000Z') },
    };

    expect(fromItem(toItem(todo))).toEqual(todo);
  });

  it('uses the TODOLIST#1 / TODO#<id> pk/sk scheme', () => {
    const item = toItem({
      id: 7,
      title: 'X',
      dateCreated: new Date('2026-07-01T00:00:00.000Z'),
      status: { status: 'todo' },
    });

    expect(item.pk).toBe('TODOLIST#1');
    expect(item.sk).toBe('TODO#7');
  });

  it('stores dates as ISO strings', () => {
    const item = toItem({
      id: 1,
      title: 'X',
      dateCreated: new Date('2026-07-01T00:00:00.000Z'),
      deadline: new Date('2026-08-15T00:00:00.000Z'),
      status: { status: 'todo' },
    });

    expect(item.dateCreated).toBe('2026-07-01T00:00:00.000Z');
    expect(item.deadline).toBe('2026-08-15T00:00:00.000Z');
  });

  it('omits dateFinished for non-done statuses', () => {
    const item = toItem({
      id: 1,
      title: 'X',
      dateCreated: new Date('2026-07-01T00:00:00.000Z'),
      status: { status: 'in-progress' },
    });

    expect(item.status).toEqual({ status: 'in-progress' });
  });

  it('leaves description/deadline undefined when absent', () => {
    const item = toItem({
      id: 1,
      title: 'X',
      dateCreated: new Date('2026-07-01T00:00:00.000Z'),
      status: { status: 'todo' },
    });

    expect(item.description).toBeUndefined();
    expect(item.deadline).toBeUndefined();

    const todo = fromItem(item);

    expect(todo.description).toBeUndefined();
    expect(todo.deadline).toBeUndefined();
  });

  it('converts fromItem status.dateFinished back into a Date', () => {
    const todo = fromItem({
      id: 1,
      title: 'X',
      dateCreated: '2026-07-01T00:00:00.000Z',
      status: { status: 'done', dateFinished: '2026-07-20T00:00:00.000Z' },
    });

    expect(todo.status.status).toBe('done');
    if (todo.status.status === 'done') {
      expect(todo.status.dateFinished).toBeInstanceOf(Date);
    }
  });
});

describe('DynamoTodosRepository', () => {
  function fakeDocClient() {
    return { send: jest.fn() };
  }

  it('create() assigns the id claimed from the atomic counter', async () => {
    const docClient = fakeDocClient();
    docClient.send
      .mockResolvedValueOnce({ Attributes: { currentId: 5 } }) // UpdateCommand
      .mockResolvedValueOnce({}); // PutCommand
    const repo = new DynamoTodosRepository(docClient as never);

    const created = await repo.create({
      title: 'First',
      dateCreated: new Date('2026-07-01T00:00:00.000Z'),
      status: { status: 'todo' },
    });

    expect(created.id).toBe(5);
  });

  it('findById() returns null when no item exists', async () => {
    const docClient = fakeDocClient();
    docClient.send.mockResolvedValueOnce({});
    const repo = new DynamoTodosRepository(docClient as never);

    await expect(repo.findById(999)).resolves.toBeNull();
  });

  it('delete() returns false when nothing was removed', async () => {
    const docClient = fakeDocClient();
    docClient.send.mockResolvedValueOnce({});
    const repo = new DynamoTodosRepository(docClient as never);

    await expect(repo.delete(999)).resolves.toBe(false);
  });

  it('delete() returns true when a row was removed', async () => {
    const docClient = fakeDocClient();
    docClient.send.mockResolvedValueOnce({ Attributes: { id: 1 } });
    const repo = new DynamoTodosRepository(docClient as never);

    await expect(repo.delete(1)).resolves.toBe(true);
  });
});
