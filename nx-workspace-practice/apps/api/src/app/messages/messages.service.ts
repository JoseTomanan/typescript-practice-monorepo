import { Injectable } from '@nestjs/common';
import { Message } from 'shared';

@Injectable()
export class MessagesService {
  getPlaceholderMessage(): Message {
    return ({ message: 'Hello Ireland Baby!' });
  }
}
