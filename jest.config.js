const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@i18n/(.*)$': '<rootDir>/src/i18n/$1',
    '^@auth/(.*)$': '<rootDir>/src/auth/$1',
    '^@styles/(.*)$': '<rootDir>/src/styles/$1'
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/e2e/', '/playwright-report/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/app/**/layout.tsx',
    '!src/app/**/page.tsx'
  ]
};

module.exports = createJestConfig(customJestConfig);
