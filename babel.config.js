module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                corejs: 3,
                useBuiltIns: 'usage',
            },
        ],
    ],
    ignore: ['**/*.native.js'],
    plugins: [
        [
            'module-resolver',
            {
                'root': ['./src', './'],
                'alias': {
                    '@test': './__tests__',
                },
            },
        ],
        [
            '@babel/plugin-proposal-class-properties',
        ],
    ],
}
