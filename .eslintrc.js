export default {
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  // 'no-console': false,
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    strict: 'off',
  },
  env: {
    node: true,
  },
};
