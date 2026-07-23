import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/out-tsc', '**/.next', '**/out'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'type:domain',
              onlyDependOnLibsWithTags: [],
            },
            {
              sourceTag: 'type:contracts',
              onlyDependOnLibsWithTags: ['type:domain'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:domain', 'type:contracts'],
            },
          ],
          // NB: the `type:domain` tag identifies the todo-domain lib; its
          // path alias is `todo-domain` (not `domain`) to avoid colliding
          // with Node's built-in `domain` core module, whose ambient
          // `@types/node` declaration would otherwise shadow the path-mapped
          // module in module resolution.
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
