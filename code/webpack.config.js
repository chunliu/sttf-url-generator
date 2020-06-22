const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    entry: {
        background: './background.js',
        'msgbox/msgbox': './msgbox/msgbox.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './manifest.json', to: 'manifest.json'  },
                { from: './msgbox/msgbox.css', to: 'msgbox/msgbox.css' },
                { from: './images', to: 'images'}
            ]
        })
    ]
};