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
    <div className="px-4 py-2">
      <h1>Welcome to web!</h1>
      <p>Message from backend: {message.message}</p>
      {/* FIXME: Tailwind in this block only not working (using CSS for now) */}
      <h1 style={{
        "fontWeight": 700,
        "fontSize": "1.5rem",
        "marginTop": "0.5rem",
      }}>
        TO DO LIST ITEMS
      </h1>
      <TodoTable initialList={todoList.list} />
    </div>
  );
}
