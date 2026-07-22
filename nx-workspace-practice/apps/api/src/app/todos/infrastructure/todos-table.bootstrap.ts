import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateTableCommand, ResourceInUseException } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DYNAMODB_CLIENT } from '../todos.constants';
import { TODOS_TABLE_NAME } from './todos.keys';
import { TodosSeeder } from './todos.seeder';

@Injectable()
export class TodosTableBootstrap implements OnModuleInit {
  private readonly logger = new Logger(TodosTableBootstrap.name);

  constructor(
    @Inject(DYNAMODB_CLIENT) private readonly docClient: DynamoDBDocumentClient,
    private readonly seeder: TodosSeeder,
  ) {}

  async onModuleInit() {
    try {
      await this.ensureTableExists();
      await this.seeder.seedIfEmpty();
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
}
