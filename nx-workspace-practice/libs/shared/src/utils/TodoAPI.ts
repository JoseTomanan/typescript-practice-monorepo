import fetchApi from './FetchAPI';
import type { TodoItem, TodoStatus } from '../../domain/TodoItem';

export async function updateTodoField(
  id: number | undefined,
  patch: Record<string, unknown>
): Promise<TodoItem | undefined> {
  if (id === undefined) return undefined;

  return fetchApi<TodoItem>(`todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
}

export async function updateTodoStatus(
  id: number | undefined,
  newStatus: TodoStatus['status']
): Promise<TodoItem | undefined> {
  if (id === undefined) return undefined;

  return fetchApi<TodoItem>(`todos/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: { status: newStatus } }),
  });
}

export async function deleteTodo(id: number | undefined): Promise<boolean> {
  if (id === undefined) return false;

  await fetchApi<{ deleted: true }>(`todos/${id}`, { method: 'DELETE' });
  return true;
}

export async function createTodo(title = 'Untitled'): Promise<TodoItem> {
  return fetchApi<TodoItem>('todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
}