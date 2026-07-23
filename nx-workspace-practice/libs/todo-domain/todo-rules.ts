import type { TodoItem, TodoStatus } from './TodoItem';

/**
 * Fields a todo can be created or edited with. Deliberately a plain domain
 * shape (not imported from `api-contracts`) — CreateTodoDto/UpdateTodoDto
 * satisfy it structurally, keeping the domain -> contracts dependency
 * one-directional.
 */
export interface TodoDraft {
  title?: string;
  description?: string;
  deadline?: Date;
  status?: TodoStatus;
}

/** Normalizes todo status and stamps completion time for done items. */
export function buildStatus(status: TodoStatus, now: Date): TodoStatus {
  if (status.status === 'done') {
    return { status: status.status, dateFinished: now };
  }

  return { status: status.status };
}

/** Creates a todo payload from request data and optional existing state. */
export function buildTodo(
  draft: TodoDraft,
  existingTodo: TodoItem | undefined,
  now: Date,
  newId?: number,
): TodoItem {
  const statusValue: TodoStatus = draft.status ?? existingTodo?.status ?? { status: 'todo' };

  return {
    id: existingTodo?.id ?? newId,
    title: draft.title ?? existingTodo?.title ?? '',
    description: draft.description ?? existingTodo?.description,
    deadline: draft.deadline ?? existingTodo?.deadline,
    dateCreated: existingTodo?.dateCreated ?? now,
    status: buildStatus(statusValue, now),
  };
}
