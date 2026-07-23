import { z } from 'zod';
import { STATUS_VALUES, TodoStatus } from 'todo-domain';

const [TODO, IN_PROGRESS, DONE] = STATUS_VALUES;

// `satisfies z.ZodType<TodoStatus>` keeps this schema's parsed output in
// lockstep with the plain `TodoStatus` domain type — a mismatch (e.g. a
// missing/extra field, or a status value not in STATUS_VALUES) fails to
// compile instead of silently drifting.
export const TodoStatusSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal(TODO) }),
  z.object({ status: z.literal(IN_PROGRESS) }),
  z.object({
    status: z.literal(DONE),
    dateFinished: z.coerce.date().optional(),
  }),
]) satisfies z.ZodType<TodoStatus>;
