/** Domain error for a todo id that doesn't exist. Framework-agnostic: no NestJS import. */
export class TodoNotFoundError extends Error {
  constructor(public readonly id: number) {
    super(`Todo ${id} not found`);
    this.name = 'TodoNotFoundError';
  }
}
