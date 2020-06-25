const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    context: path.resolve(__dirname, 'src'),
    entry: {
        background: './background.js',
        'msgbox/msgbox': './msgbox/msgbox.js',
        'popup/popup': './popup/popup.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js?$/,
                loader: 'eslint-loader',
                exclude: [path.resolve(__dirname, 'node_modules')]
            },
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                exclude: [path.resolve(__dirname, 'node_modules')]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: './manifest.json', to: 'manifest.json'  },
                { from: './msgbox/msgbox.css', to: 'msgbox/msgbox.css' },
                { from: './popup/popup.html', to: 'popup/popup.html'},
                { from: './popup/popup.css', to: 'popup/popup.css'},
                { from: './images', to: 'images'}
            ]
        })
    ]
};