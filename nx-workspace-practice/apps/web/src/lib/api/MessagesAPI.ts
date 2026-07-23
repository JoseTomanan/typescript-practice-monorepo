import { fetchApi } from './FetchAPI';
import type { Message } from 'todo-domain';

export async function getMessage(): Promise<Message> {
  return fetchApi<Message>('messages', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
