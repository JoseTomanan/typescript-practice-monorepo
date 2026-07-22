import { TodoItem } from 'shared';

/**
 * Repository port. An abstract class (not a TS `interface`) so it survives to
 * runtime and can be used directly as a Nest DI token — no string token,
 * no `@Inject()` decorator needed at the injection site.
 *
 * Misses are reported as `null`; deciding whether that's exceptional is the
 * service's job, not the repository's.
 */
export abstract class ITodosRepository {
  abstract findAll(): Promise<TodoItem[]>;

  abstract findById(id: number): Promise<TodoItem | null>;

  /** Assigns the item's id (e.g. via an atomic counter) and persists it. */
  abstract create(todo: TodoItem): Promise<TodoItem>;

  /** Persists a full overwrite of an existing todo. */
  abstract save(todo: TodoItem): Promise<void>;

  /** Returns `true` if a row was removed, `false` if none existed. */
  abstract delete(id: number): Promise<boolean>;
}
