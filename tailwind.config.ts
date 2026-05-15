import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/modules/**/*.{ts,tsx}',
    './node_modules/@biaenergy/ui/dist/**/*.{js,mjs}'
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

export default config;
