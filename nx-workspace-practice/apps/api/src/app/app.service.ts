import { Injectable } from '@nestjs/common';
import { Message } from 'shared';

@Injectable()
export class AppService {
  getData(): Message {
    return ({ message: 'Hello Ireland Baby!' });
  }
}
