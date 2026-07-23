import { Module } from '@nestjs/common';
import { TodosController } from './presentation/todos.controller';
import { TodosService } from './application/todos.service';
import { TodosInfraModule } from './infrastructure/todos-infra.module';

@Module({
  imports: [TodosInfraModule],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
