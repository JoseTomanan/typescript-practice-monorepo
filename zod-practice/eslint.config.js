import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Provided reference/scaffolding files, not part of the schema work.
    // They intentionally @ts-ignore imports of source files that don't exist.
    ignores: [
      'node_modules',
      'dist',
      'zod-exercise-schema.ts',
      'libs/dto/src/lib/enum/enum.array.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
