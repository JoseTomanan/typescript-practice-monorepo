import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamoDbModule } from './dynamodb/dynamodb.module';
import { MessagesModule } from './messages/messages.module';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [DynamoDbModule, MessagesModule, TodosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
