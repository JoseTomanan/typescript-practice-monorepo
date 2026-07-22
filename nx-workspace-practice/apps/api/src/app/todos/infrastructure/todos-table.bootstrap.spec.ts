import { TodosTableBootstrap } from './todos-table.bootstrap';
import { TodosSeeder } from './todos.seeder';

describe('TodosTableBootstrap', () => {
  it('wraps unreachable DynamoDB startup failures with a clear message', async () => {
    const connectionError = new Error('fetch failed');
    connectionError.name = 'AggregateError';

    const docClient = {
      send: jest.fn().mockRejectedValue(connectionError),
    } as never;
    const seeder = { seedIfEmpty: jest.fn() } as unknown as TodosSeeder;

    const bootstrap = new TodosTableBootstrap(docClient, seeder);

    await expect(bootstrap.onModuleInit()).rejects.toThrow(
      'Cannot reach DynamoDB Local at http://localhost:8000',
    );
  });
});
