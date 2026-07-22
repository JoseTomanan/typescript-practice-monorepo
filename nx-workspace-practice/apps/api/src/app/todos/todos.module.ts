import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TodosInfraModule } from './infrastructure/todos-infra.module';

@Module({
  imports: [TodosInfraModule],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}
