import { TodosModule } from './todos.module';

describe('TodosModule', () => {
  it('wraps unreachable DynamoDB startup failures with a clear message', async () => {
    const connectionError = new Error('fetch failed');
    connectionError.name = 'AggregateError';

    const docClient = {
      send: jest.fn().mockRejectedValue(connectionError),
    } as never;

    const module = new TodosModule(docClient);

    await expect(module.onModuleInit()).rejects.toThrow(
      'Cannot reach DynamoDB Local at http://localhost:8000',
    );
  });
});
