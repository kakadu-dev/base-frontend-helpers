const modules      = process.env.ESM ? false : 'commonjs'
const useESModules = !!process.env.ESM

module.exports = {
    presets: [
        ['module:metro-react-native-babel-preset'],
        ['@babel/preset-env', {
            loose: true,
            shippedProposals: true,
            modules,
            targets: {
                'ie': 9,
            },
        }],
    ],
    plugins: [
        ['module-resolver', {
            root: ['./src', './'],
            alias: { '@test': './__tests__' },
        },
        ],
        ['@babel/plugin-proposal-class-properties'],
        ['@babel/plugin-transform-runtime', { useESModules }],
    ],
}
