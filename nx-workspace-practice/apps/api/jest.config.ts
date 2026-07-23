export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  // Resolve the `domain`/`api-contracts` TS path aliases (defined in tsconfig.base.json) for Jest.
  moduleNameMapper: {
    '^todo-domain$': '<rootDir>/../../libs/todo-domain/index.ts',
    '^api-contracts$': '<rootDir>/../../libs/api-contracts/index.ts',
  },
  coverageDirectory: '../../coverage/apps/api',
};
