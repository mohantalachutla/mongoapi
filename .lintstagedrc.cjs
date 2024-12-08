module.exports = {
  '*.css': ['stylelint --fix', 'prettier --write'],
  '*.{js,jsx, ts,tsx, mjs, cjs}': ['eslint --fix', 'prettier --write'],
  '*.json': ['prettier --write'],
};
