module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Lo único que enforced fuerte: el type prefix.
    // Habilita changelogs / semver futuros y permite scan rápido del historial.
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']
    ],

    // Reglas cosméticas relajadas para flujo AI (Cursor, Claude Code, etc.).
    // Las herramientas de AI generan mensajes largos y descriptivos — no rompemos por eso.
    'header-max-length': [0],
    'body-max-line-length': [0],
    'subject-full-stop': [0],
    'subject-case': [0],
    'body-leading-blank': [0],
    'footer-leading-blank': [0],
    'footer-max-line-length': [0]
  }
};
