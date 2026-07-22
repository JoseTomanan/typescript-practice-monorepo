import { Injectable, Logger } from '@nestjs/common';
import { ITodosRepository } from '../application/todos.repository';
import { SEED_TODOS } from './seed-data';

/**
 * Populates an empty todos table with `SEED_TODOS` on first boot, through the
 * repository port — no hand-rolled marshalling here.
 */
@Injectable()
export class TodosSeeder {
  private readonly logger = new Logger(TodosSeeder.name);

  constructor(private readonly repository: ITodosRepository) {}

  async seedIfEmpty(): Promise<void> {
    const count = await this.repository.findAll();

    if (count.length === 0) {
      for (const todo of SEED_TODOS) {
        await this.repository.create(todo);
      }
      this.logger.log(`Seeded ${SEED_TODOS.length} todos`);
    }
  }
}