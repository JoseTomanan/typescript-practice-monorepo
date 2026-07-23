import { TodoItem } from 'todo-domain';
import { ITodosRepository } from '../application/todos.repository';
import { TodosSeeder } from './todos.seeder';
import { SEED_TODOS } from './seed-data';

describe('TodosSeeder', () => {
  function fakeRepository(existing: TodoItem[]): ITodosRepository {
    return {
      findAll: jest.fn().mockResolvedValue(existing),
      findById: jest.fn(),
      create: jest.fn().mockImplementation(async (todo: TodoItem) => todo),
      save: jest.fn(),
      delete: jest.fn(),
    };
  }

  it('seeds every todo in order when the table is empty', async () => {
    const repository = fakeRepository([]);
    const seeder = new TodosSeeder(repository);

    await seeder.seedIfEmpty();

    expect(repository.create).toHaveBeenCalledTimes(SEED_TODOS.length);
    SEED_TODOS.forEach((todo, index) => {
      expect(repository.create).toHaveBeenNthCalledWith(index + 1, todo);
    });
  });

  it('does nothing when the table already has todos', async () => {
    const repository = fakeRepository([SEED_TODOS[0]]);
    const seeder = new TodosSeeder(repository);

    await seeder.seedIfEmpty();

    expect(repository.create).not.toHaveBeenCalled();
  });
});
