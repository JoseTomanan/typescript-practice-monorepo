export default {
  displayName: 'web',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  // Resolve the `shared` TS path alias (defined in tsconfig.base.json) for Jest.
  moduleNameMapper: {
    '^shared$': '<rootDir>/../../libs/shared/index.ts',
  },
  coverageDirectory: '../../coverage/apps/web',
};
