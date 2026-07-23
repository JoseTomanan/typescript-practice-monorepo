export default {
  displayName: 'web',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  // Resolve the `domain`/`api-contracts` TS path aliases (defined in tsconfig.base.json) for Jest.
  moduleNameMapper: {
    '^todo-domain$': '<rootDir>/../../libs/todo-domain/index.ts',
    '^api-contracts$': '<rootDir>/../../libs/api-contracts/index.ts',
  },
  coverageDirectory: '../../coverage/apps/web',
};
