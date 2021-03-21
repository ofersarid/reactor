module.exports = {
  extends: ['standard', 'plugin:react/recommended'],
  rules: {
    semi: ['error', 'always'],
    'comma-dangle': [
      'error',
      {
        arrays: 'never',
        objects: 'ignore',
        imports: 'never',
        exports: 'never',
        functions: 'ignore'
      }
    ],
    'space-before-function-paren': 0,
    'no-new': 0,
    indent: 0,
    'react/display-name': 0
  },
  globals: {
    File: true,
    Audio: true,
    Image: true,
    FileReader: true,
    Blob: true,
    process: true
  }
};
