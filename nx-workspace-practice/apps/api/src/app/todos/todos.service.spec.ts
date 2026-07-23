import { TodoItem } from 'todo-domain';
import { ITodosRepository } from './application/todos.repository';
import { TodosService } from './todos.service';
import { TodoNotFoundError } from './exceptions/todo-not-found.error';

/** In-memory fake for ITodosRepository — no AWS mocking, just a Map + counter. */
class InMemoryTodosRepository extends ITodosRepository {
  private readonly items = new Map<number, TodoItem>();
  private counter = 0;

  async findAll(): Promise<TodoItem[]> {
    return [...this.items.values()];
  }

  async findById(id: number): Promise<TodoItem | null> {
    return this.items.get(id) ?? null;
  }

  async create(todo: TodoItem): Promise<TodoItem> {
    const stored = { ...todo, id: ++this.counter };
    this.items.set(stored.id, stored);
    return stored;
  }

  async save(todo: TodoItem): Promise<void> {
    this.items.set(todo.id as number, todo);
  }

  async delete(id: number): Promise<boolean> {
    return this.items.delete(id);
  }

  seed(todo: TodoItem) {
    this.items.set(todo.id as number, todo);
    this.counter = Math.max(this.counter, todo.id as number);
  }
}

function existingTodo(overrides: Partial<TodoItem> = {}): TodoItem {
  return {
    id: 1,
    title: 'Existing',
    dateCreated: new Date('2026-07-01T00:00:00.000Z'),
    status: { status: 'todo' },
    ...overrides,
  };
}

describe('TodosService', () => {
  let repo: InMemoryTodosRepository;
  let service: TodosService;

  beforeEach(() => {
    repo = new InMemoryTodosRepository();
    service = new TodosService(repo);
  });

  describe('getTodos', () => {
    it('returns a TodoList wrapping all stored todos, sorted by id', async () => {
      repo.seed(existingTodo({ id: 2, title: 'Second' }));
      repo.seed(existingTodo({ id: 1, title: 'First' }));

      const todos = await service.getTodos();

      expect(todos.id).toBe(1);
      expect(todos.list.map((t) => t.id)).toEqual([1, 2]);
      expect(todos.list[0].dateCreated).toBeInstanceOf(Date);
    });
  });

  describe('createTodo', () => {
    it('creates a todo with the given title and stores it', async () => {
      const created = await service.createTodo({ title: 'First' });

      expect(created.title).toBe('First');
      expect(created.id).toBe(1);
    });

    it('assigns the id claimed from the repository', async () => {
      await service.createTodo({ title: 'A' });
      const created = await service.createTodo({ title: 'B' });

      expect(created.id).toBe(2);
    });

    it('defaults the status to "todo" and stamps dateCreated', async () => {
      const created = await service.createTodo({ title: 'Defaults' });

      expect(created.status).toEqual({ status: 'todo' });
      expect(created.dateCreated).toBeInstanceOf(Date);
    });
  });

  describe('getTodo', () => {
    it('returns the matching todo', async () => {
      repo.seed(existingTodo());

      const todo = await service.getTodo(1);

      expect(todo.id).toBe(1);
      expect(todo.title).toBe('Existing');
    });

    it('throws TodoNotFoundError for an unknown id', async () => {
      await expect(service.getTodo(999)).rejects.toThrow(TodoNotFoundError);
    });
  });

  describe('updateTodo', () => {
    it('updates fields while preserving the id', async () => {
      repo.seed(existingTodo());

      const updated = await service.updateTodo(1, {
        title: 'New',
        description: 'desc',
      });

      expect(updated.id).toBe(1);
      expect(updated.title).toBe('New');
      expect(updated.description).toBe('desc');
    });

    it('throws TodoNotFoundError for an unknown id', async () => {
      await expect(service.updateTodo(999, { title: 'X' })).rejects.toThrow(TodoNotFoundError);
    });
  });

  describe('updateTodoStatus', () => {
    it('stamps dateFinished when moving to done', async () => {
      repo.seed(existingTodo());

      const updated = await service.updateTodoStatus(1, { status: { status: 'done' } });

      expect(updated.status.status).toBe('done');
      if (updated.status.status === 'done') {
        expect(updated.status.dateFinished).toBeInstanceOf(Date);
      }
    });

    it('does not stamp dateFinished for non-done statuses', async () => {
      repo.seed(existingTodo());

      const updated = await service.updateTodoStatus(1, {
        status: { status: 'in-progress' },
      });

      expect(updated.status).toEqual({ status: 'in-progress' });
    });
  });

  describe('deleteTodo', () => {
    it('removes the todo and reports success', async () => {
      repo.seed(existingTodo());

      await expect(service.deleteTodo(1)).resolves.toEqual({ deleted: true });
    });

    it('throws TodoNotFoundError for an unknown id', async () => {
      await expect(service.deleteTodo(999)).rejects.toThrow(TodoNotFoundError);
    });
  });
});
