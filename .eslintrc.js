const path = require('path');

module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true,
    },
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'project': path.resolve(__dirname, "./tsconfig.json"),
        'sourceType': 'module',
    },
    ignorePatterns: [
        'db-data',
        'test',
        'ormconfig.ts'
    ],
    extends: [
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended"
    ],
    'plugins': [
        '@typescript-eslint',
        '@typescript-eslint/tslint',
        'prettier',
        'simple-import-sort',
    ],
    'rules': {}
};
