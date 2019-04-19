module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: "standard",
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'camelcase': 'off'
  },
  parser: 'babel-eslint'
}
