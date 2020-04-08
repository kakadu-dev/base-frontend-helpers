const presets = !process.env.ESM ?
    [
        ['@babel/preset-react'],
        ['@babel/preset-env', {
            targets: { node: 'current' },
            shippedProposals: true,
            modules: 'commonjs',
            corejs: 3,
            useBuiltIns: 'usage',
        }],
    ] : null

module.exports = {
    presets,
    plugins: [
        ['module-resolver', {
            root: ['./src', './'],
            alias: { '@test': './__tests__' },
        }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        ['@babel/plugin-transform-runtime', { useESModules: false }],
    ],
    ignore: ['**/*.native.js', '**/Form/index.js'],
}
