// Single source of truth for the set of valid todo statuses. Both the
// domain `TodoStatus` type and the `TodoStatusSchema` Zod schema
// (api-contracts) derive from this tuple instead of hand-duplicating the
// literals.
export const STATUS_VALUES = ['todo', 'in-progress', 'done'] as const;

export type TodoStatusValue = (typeof STATUS_VALUES)[number];
