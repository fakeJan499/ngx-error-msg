export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            ['chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'test'],
        ],
        'body-empty': [2, 'never'],
        'body-min-length': [2, 'always', 20],
    },
};
