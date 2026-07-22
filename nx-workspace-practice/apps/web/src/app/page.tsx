import { Message, TodoList } from 'shared';
import fetchApi from 'shared';
import TodoTable from './TodoTable';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const message: Message = await fetchApi('messages', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const todoList = await fetchApi<TodoList>('todos');

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">
        MESSAGE FROM BACKEND
      </h1>
      <p>{message.message}</p>
      <h1 className="text-2xl font-bold">
        TO DO LIST ITEMS
      </h1>
      <TodoTable initialList={todoList.list} />
    </div>
  );
}
