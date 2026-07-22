import { Global, Inject, Logger, Module, OnModuleInit } from '@nestjs/common';
import {
  CreateTableCommand,
  DynamoDBClient,
  ResourceInUseException,
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { DYNAMODB_CLIENT } from './todos.constants';
import { COUNTER_SK, TODOS_TABLE_NAME, TODO_LIST_PK, todoSortKey } from './infrastructure/todos.keys';
import { ITodosRepository } from './application/todos.repository';
import { DynamoTodosRepository } from './infrastructure/repositories/dynamo-todos.repository';

/** The same seed data TodosService used to hold in memory. */
const SEED_TODOS = [
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
];

const documentClientFactory = {
  provide: DYNAMODB_CLIENT,
  useFactory: (): DynamoDBDocumentClient => {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION ?? 'local',
      endpoint: process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000',
      // DynamoDB Local ignores these, but the SDK refuses to start without something set.
      credentials: {
        accessKeyId: 'local',
        secretAccessKey: 'local',
      },
    });

    // Todo items omit `description`/`deadline` when absent — without this the
    // doc client throws on `undefined` instead of just skipping the attribute.
    return DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  },
};

@Global()
@Module({
  controllers: [TodosController],
  providers: [
    documentClientFactory,
    { provide: ITodosRepository, useClass: DynamoTodosRepository },
    TodosService,
  ],
  exports: [DYNAMODB_CLIENT],
})
export class TodosModule implements OnModuleInit {
  private readonly logger = new Logger(TodosModule.name);

  constructor(@Inject(DYNAMODB_CLIENT) private readonly docClient: DynamoDBDocumentClient) {}

  async onModuleInit() {
    try {
      await this.ensureTableExists();
      await this.seedIfEmpty();
    } catch (error) {
      const bootstrapError = this.toBootstrapError(error);

      if (bootstrapError) throw bootstrapError;

      throw error;
    }
  }

  private toBootstrapError(error: unknown): Error | null {
    if (!(error instanceof Error)) return null;

    if (
      error.name === 'AggregateError' ||
      /econnrefused|fetch failed/i.test(error.message)
    ) {
      const endpoint = process.env.DYNAMODB_ENDPOINT ?? 'http://localhost:8000';

      const bootstrapError = new Error(
        `Cannot reach DynamoDB Local at ${endpoint}. Start it with "docker compose up -d dynamodb-local" or set DYNAMODB_ENDPOINT to a reachable endpoint.`,
      );

      (bootstrapError as Error & { cause?: Error }).cause = error;

      return bootstrapError;
    }

    return null;
  }

  private async ensureTableExists() {
    try {
      // DynamoDBDocumentClient forwards non-item commands to the underlying
      // client unmarshalled, so it can send control-plane commands too.
      await this.docClient.send(
        new CreateTableCommand({
          TableName: TODOS_TABLE_NAME,
          AttributeDefinitions: [
            { AttributeName: 'pk', AttributeType: 'S' },
            { AttributeName: 'sk', AttributeType: 'S' },
          ],
          KeySchema: [
            { AttributeName: 'pk', KeyType: 'HASH' },
            { AttributeName: 'sk', KeyType: 'RANGE' },
          ],
          BillingMode: 'PAY_PER_REQUEST',
        }),
      );
      this.logger.log(`Created table "${TODOS_TABLE_NAME}"`);
    } catch (error) {
      if (!(error instanceof ResourceInUseException)) throw error;
    }
  }

  private async seedIfEmpty() {
    const existing = await this.docClient.send(
      new QueryCommand({
        TableName: TODOS_TABLE_NAME,
        KeyConditionExpression: 'pk = :pk AND begins_with(sk, :prefix)',
        ExpressionAttributeValues: { ':pk': TODO_LIST_PK, ':prefix': 'TODO#' },
        Limit: 1,
      }),
    );

    if ((existing.Items?.length ?? 0) > 0) return;

    for (const todo of SEED_TODOS) {
      await this.docClient.send(
        new PutCommand({
          TableName: TODOS_TABLE_NAME,
          // DynamoDB can't marshall JS Date objects directly — store ISO
          // strings, same as DynamoTodosRepository's toItem() does for writes at runtime.
          Item: {
            pk: TODO_LIST_PK,
            sk: todoSortKey(todo.id),
            id: todo.id,
            title: todo.title,
            description: todo.description,
            dateCreated: todo.dateCreated.toISOString(),
            deadline: todo.deadline?.toISOString(),
            status:
              todo.status.status === 'done'
                ? { status: todo.status.status, dateFinished: todo.status.dateFinished?.toISOString() }
                : { status: todo.status.status },
          },
        }),
      );
    }

    await this.docClient.send(
      new PutCommand({
        TableName: TODOS_TABLE_NAME,
        Item: { pk: TODO_LIST_PK, sk: COUNTER_SK, currentId: SEED_TODOS.length },
      }),
    );

    this.logger.log(`Seeded ${SEED_TODOS.length} todos`);
  }
}
