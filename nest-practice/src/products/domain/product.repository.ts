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

  // TODO: findAll() filtering of category
}

// DI token NestJS will use to bind this interface to a concrete class,
// since interfaces don't exist at runtime and can't be used as tokens.
export const PRODUCT_REPOSITORY = Symbol('PRODUCT_REPOSITORY');
