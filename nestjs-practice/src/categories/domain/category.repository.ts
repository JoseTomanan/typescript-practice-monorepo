import { Category } from './category.entity';

/**
 * Port: what the application layer needs from persistence, with zero
 * knowledge of HOW it's stored (in-memory array today, a database later).
 * The infrastructure layer implements this; nothing in domain/ or
 * application/ may import the implementation directly.
 */
export interface CategoryRepository {
  findAll(): Category[];
  findOne(id: number): Category | undefined;
  save(category: Category): Category;
  remove(id: number): Category | undefined;
}

// DI token NestJS will use to bind this interface to a concrete class,
// since interfaces don't exist at runtime and can't be used as tokens.
export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');
