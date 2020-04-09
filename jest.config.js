process.env.BUILD_TARGET = 'client'

module.exports = {
    verbose: true,
    collectCoverageFrom: [
        'src/api/**/*.{js,jsx}',
        'src/helpers/**/*.{js,jsx}',
        'src/services/**/*.{js,jsx}',
    ],
    moduleFileExtensions: [
        'js',
        'jsx',
    ],
}
