import { Module } from '@nestjs/common';
import { ITodosRepository } from '../application/todos.repository';
import { documentClientFactory } from './dynamodb.provider';
import { DynamoTodosRepository } from './repositories/dynamo-todos.repository';
import { TodosSeeder } from './todos.seeder';
import { TodosTableBootstrap } from './todos-table.bootstrap';

/**
 * Owns everything DynamoDB-shaped for the todos domain: the document client,
 * the repository adapter behind `ITodosRepository`, and table bootstrap/seed
 * on startup. Nothing outside this module needs the raw client.
 */
@Module({
  providers: [
    documentClientFactory,
    { provide: ITodosRepository, useClass: DynamoTodosRepository },
    TodosSeeder,
    TodosTableBootstrap,
  ],
  exports: [ITodosRepository],
})
export class TodosInfraModule {}
