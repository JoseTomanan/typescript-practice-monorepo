'use client';

import { useState } from 'react';
import {
  createTodo,
  deleteTodo,
  TodoItem,
  TodoStatus,
  updateTodoField,
  updateTodoStatus,
} from 'shared';
import type { TodoTableProps } from 'shared';

const STATUS_VALUES: TodoStatus['status'][] = ['todo', 'in-progress', 'done'];

export default function TodoTable({ initialList }: TodoTableProps) {
  const [items, setItems] = useState<TodoItem[]>(initialList);

  function mergeItem(updated: TodoItem) {
    setItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  }

  async function patchField(id: number | undefined, patch: Record<string, unknown>) {
    const updated = await updateTodoField(id, patch);
    if (!updated) return;
    mergeItem(updated);
  }

  async function handleStatusChange(item: TodoItem, newStatus: TodoStatus['status']) {
    const updated = await updateTodoStatus(item.id, newStatus);
    if (!updated) return;
    mergeItem(updated);
  }

  async function handleDelete(id: number | undefined) {
    const deleted = await deleteTodo(id);
    if (!deleted || id === undefined) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleAdd() {
    const created = await createTodo();
    setItems((prev) => [...prev, created]);
  }

  const cellInputClasses =
    'w-full box-border rounded px-1.5 py-1 font-inherit text-inherit bg-transparent border-none outline-none focus:bg-blue-50';

  return (
    <div>
      <table className="w-full border-collapse mb-3 text-sm">
        <thead>
          <tr>
            <th className="text-left px-2.5 py-1.5 border-b border-neutral-200 text-neutral-500 font-medium">Title</th>
            <th className="text-left px-2.5 py-1.5 border-b border-neutral-200 text-neutral-500 font-medium">Description</th>
            <th className="text-left px-2.5 py-1.5 border-b border-neutral-200 text-neutral-500 font-medium">Status</th>
            <th className="text-left px-2.5 py-1.5 border-b border-neutral-200 text-neutral-500 font-medium">Deadline</th>
            <th className="text-left px-2.5 py-1.5 border-b border-neutral-200 text-neutral-500 font-medium">Created</th>
            <th className="text-left px-2.5 py-1.5 border-b border-neutral-200 text-neutral-500 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-neutral-50">
              <td className="px-2.5 py-1 border-b border-neutral-100 align-middle">
                <input
                  className={cellInputClasses}
                  defaultValue={item.title}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== item.title) {
                      patchField(item.id, { title: value });
                    }
                  }}
                />
              </td>
              <td className="px-2.5 py-1 border-b border-neutral-100 align-middle">
                <input
                  className={cellInputClasses}
                  defaultValue={item.description ?? ''}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value !== (item.description ?? '')) {
                      patchField(item.id, { description: value });
                    }
                  }}
                />
              </td>
              <td className="px-2.5 py-1 border-b border-neutral-100 align-middle">
                <select
                  className={cellInputClasses}
                  value={item.status.status}
                  onChange={(e) =>
                    handleStatusChange(item, e.target.value as TodoStatus['status'])
                  }
                >
                  {STATUS_VALUES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-2.5 py-1 border-b border-neutral-100 align-middle">
                <input
                  type="date"
                  className={cellInputClasses}
                  defaultValue={item.deadline?.toString().slice(0, 10)}
                  onChange={(e) => patchField(item.id, { deadline: e.target.value })}
                />
              </td>
              <td className="px-2.5 py-1 border-b border-neutral-100 align-middle">{new Date(item.dateCreated).toLocaleDateString()}</td>
              <td className="px-2.5 py-1 border-b border-neutral-100 align-middle">
                <button
                  className="border-none bg-transparent cursor-pointer text-neutral-400 text-[13px] px-1.5 py-0.5 rounded hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(item.id)}
                  aria-label="Delete row"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="border-none bg-transparent cursor-pointer text-neutral-500 text-sm px-2.5 py-1.5 rounded hover:bg-neutral-100 hover:text-neutral-900"
        onClick={handleAdd}
      >
        + New
      </button>
    </div>
  );
}
