import type { Message, TodoList } from 'shared';
import { getMessage } from '../lib/api/MessagesAPI';
import { getTodos } from '../lib/api/TodoAPI';
import TodoTable from './components/TodoTable';

export const dynamic = 'force-dynamic';

export default async function Index() {
  const message: Message = await getMessage();

  const todoList: TodoList = await getTodos();

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">
        {/* TODO: make this toast; import component from shadcn */}
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
