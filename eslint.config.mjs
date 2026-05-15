import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

// =====================================================================
// Boundaries — ver docs/CONVENTIONS.md (sección "Boundaries")
//
// Capa 1 — Cross-module: solo barrel.
// Capa 2 — Layers dentro de un módulo (models < dictionaries < data <
//          store < hooks < components).
// Capa 3 — Paquetes/imports prohibidos (axios, next/router, etc.).
// =====================================================================

const crossModuleBarrelOnly = {
  group: ['@modules/*/*'],
  message:
    'Cross-module: importá solo el barrel (`@modules/X`). Imports profundos como `@modules/X/components/Y` están prohibidos. Dentro del mismo módulo usá rutas relativas (`./`, `../`).'
};

const bannedPaths = [
  { name: 'axios', message: 'Usá doFetch (src/http_client/Bia). Stack: fetch + doFetch, sin axios.' },
  { name: 'next/router', message: 'Next 16: usá next/navigation.' },
  { name: 'cross-fetch', message: 'Usá doFetch (src/http_client/Bia).' },
  { name: 'isomorphic-fetch', message: 'Usá doFetch (src/http_client/Bia).' }
];

const restrictedImports = (...layerPatterns) => [
  'error',
  {
    paths: bannedPaths,
    patterns: [crossModuleBarrelOnly, ...layerPatterns]
  }
];

const at = segment => [
  `../${segment}/**`,
  `../../${segment}/**`,
  `../../../${segment}/**`
];

const noLayers = (...segments) => ({
  group: segments.flatMap(at),
  message: `Esta capa no puede importar: ${segments.join(', ')}. Ver docs/CONVENTIONS.md (sección Boundaries).`
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      'no-restricted-imports': restrictedImports()
    }
  },

  {
    files: ['src/modules/*/models/**', 'src/modules/*/dictionaries/**'],
    rules: {
      'no-restricted-imports': restrictedImports(
        noLayers('components', 'data', 'hooks', 'store')
      )
    }
  },

  {
    files: ['src/modules/*/data/**'],
    rules: {
      'no-restricted-imports': restrictedImports(
        noLayers('components', 'hooks', 'store', 'dictionaries')
      )
    }
  },

  {
    files: ['src/modules/*/store/**'],
    rules: {
      'no-restricted-imports': restrictedImports(
        noLayers('components', 'hooks', 'data', 'dictionaries')
      )
    }
  },

  {
    files: ['src/modules/*/hooks/**'],
    rules: {
      'no-restricted-imports': restrictedImports(
        noLayers('components', 'dictionaries')
      )
    }
  },

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    '*.config.js',
    'jest.config.js',
    '.lintstagedrc.js',
    'commitlint.config.js'
  ])
]);

export default eslintConfig;
