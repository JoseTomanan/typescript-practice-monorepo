/**
 * TODO: review — new file, added to replace `@Param('id', ParseIntPipe) id: number`
 * across both controllers, once the global pipe's `strictSchemaDeclaration: true`
 * (see app.pipe.ts) made that pattern throw a 500.
 *
 * `z.coerce.number()` is the Zod equivalent of `ParseIntPipe`: route params
 * arrive from Express as strings (`":id"` segment of the URL is always a
 * string), and `.coerce` runs `Number(value)` before the rest of the schema's
 * checks apply. `.int().positive()` then rejects non-integers/non-positive
 * values the same way `ParseIntPipe` rejected non-numeric strings — Zod's
 * `z.number()` check itself rejects `NaN`, so `Number("abc")` -> `NaN` still
 * fails validation and produces a 400, same outward behavior as before.
 *
 * Important Nest quirk this depends on: `@Param('id', SomePipe)` (decorator
 * called *with a key*) hands the pipe just that one field's string value, and
 * the param's metatype is whatever TS type you annotated it with (`number`
 * here) — which the global ZodValidationPipe can't match to a zod-dto class,
 * since it isn't one. `@Param()` (no key) instead hands the pipe the *whole*
 * params object (e.g. `{ id: "5" }`), and the metatype is whatever class you
 * typed the whole param as. So the fix isn't just "swap ParseIntPipe for
 * Zod" — it's "stop validating one field at a time and instead validate
 * the whole params/query object through one Zod-dto class", since only the
 * latter shape is something `isZodDto(metatype)` can recognize.
 */
import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const IdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export class IdParamDto extends createZodDto(IdParamSchema) {}
