export default {
  displayName: 'api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  // Resolve the `shared` TS path alias (defined in tsconfig.base.json) for Jest.
  moduleNameMapper: {
    '^shared$': '<rootDir>/../../libs/shared/src/index.ts',
  },
  coverageDirectory: '../../coverage/apps/api',
};
