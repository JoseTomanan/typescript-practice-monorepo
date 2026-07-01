// NOTE: not using the `@dto` path alias here — TS path aliases are compile-time
// only and `nest build`/`nest start` (plain tsc) don't rewrite them into
// resolvable runtime paths. A plain relative specifier (with the `.js`
// extension nodenext requires) works the same way the schema files already do.
import { buildingSchema } from '../../libs/dto/src/index.js';
import { z } from 'zod';

// Request-body schemas derived from the canonical `buildingSchema` (libs/dto).
// `buildingId`/`created`/`updated` etc. are server-assigned, so callers never
// send them on create — everything else in `buildingSchema` is already optional
// there, so `createBuildingSchema` can reuse it as-is.
export const createBuildingSchema = buildingSchema;
export type CreateBuildingDto = z.infer<typeof createBuildingSchema>;

// Updates are partial — a PUT/PATCH body may set any subset of fields.
export const updateBuildingSchema = buildingSchema.partial();
export type UpdateBuildingDto = z.infer<typeof updateBuildingSchema>;

// Query params supported by GET /buildings (see TODO.md: "support optional
// query filters: leaseType, status").
export const findBuildingsQuerySchema = z.object({
  leaseType: buildingSchema.shape.leaseType,
  status: buildingSchema.shape.status,
});
export type FindBuildingsQueryDto = z.infer<typeof findBuildingsQuerySchema>;
