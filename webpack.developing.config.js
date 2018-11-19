const merge = require('webpack-merge');
const common = require('./webpack.common.config');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'scss-loader'
                ]
            }
        ]
    },
    devServer: {
        contentBase: './dist',
        port: 3200,
        overlay: true,
        hot: true
    }
});