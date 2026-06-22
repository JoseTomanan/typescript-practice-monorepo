import { Product } from './product.entity';

/**
 * Port: what the application layer needs from persistence, with zero
 * knowledge of HOW it's stored (in-memory array today, a database later).
 * The infrastructure layer implements this; nothing in domain/ or
 * application/ may import the implementation directly.
 */
export interface ProductRepository {
  findAll(): Product[];
  findOne(id: number): Product | undefined;
  save(product: Product): Product;
  remove(id: number): Product | undefined;

  // TODO: findAll() currently has no args, but products.service.ts:46-87
  // filters by categoryId/page/limit/search. Decide: should those
  // params live on this interface (repository does the filtering), or
  // should findAll() return everything and a use case filters in memory?
  // That decision is the actual architecture call here — not boilerplate.
}

// DI token NestJS will use to bind this interface to a concrete class,
// since interfaces don't exist at runtime and can't be used as tokens.
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
