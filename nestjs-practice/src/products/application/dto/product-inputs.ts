/**
 * TODO: review — new abstraction introduced during implementation, not
 * a mirror of an existing categories/products pattern. Categories' use
 * cases take plain primitives (e.g. `name: string`) instead of a
 * dedicated input type; this file exists only for Products because its
 * DTOs have 4 fields instead of 1. Confirm this is the input shape you
 * want before relying on it elsewhere.
 *
 * Application-layer input types. These are what the use cases accept —
 * plain data, no Zod schemas, no NestJS coupling. The
 * presentation DTOs are structurally compatible, so controllers can pass
 * them straight through
 * without any mapping step.
 */
export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
}

export interface ReplaceProductInput {
  name: string;
  price: number;
  stock: number;
  categoryId: number;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  stock?: number;
  categoryId?: number;
}
