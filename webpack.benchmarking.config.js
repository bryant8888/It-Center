const merge = require('webpack-merge');
const common = require('./webpack.common.config');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = merge(common, {
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "scss-loader"
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css")
    ]
});