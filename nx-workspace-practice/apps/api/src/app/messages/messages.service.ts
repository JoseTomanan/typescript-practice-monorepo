import { Injectable } from '@nestjs/common';
import { Message } from 'todo-domain';

@Injectable()
export class MessagesService {
  getPlaceholderMessage(): Message {
    return ({ message: 'Hello Ireland Baby!' });
  }
}
