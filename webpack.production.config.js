const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.config');
const webpack = require('webpack');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin')

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
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
        new UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new ExtractTextPlugin("styles.css"),
        new ReplaceInFileWebpackPlugin([{
            dir: 'dist',
            files: ['index.html'],
            rules: [
                {
                    search: /src="\//g,
                    replace: 'src="./'
                }
            ]
        }])
    ]
});