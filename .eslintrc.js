module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/strict',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended'
    ],
    rules: {
        "no-use-before-define": "error",
        "@typescript-eslint/no-unused-vars": [
            2,
            {
                "args": "none"
            }
        ],
        // Disable ESLint's indent rule as we're using Prettier for formatting
        "indent": "off",
        "react/react-in-jsx-scope": "off",
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    overrides: [{
        files: ['*.config.js'],
        env: {
            node: true,
        },
    }, ],
};