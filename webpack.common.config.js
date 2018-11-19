const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const webpack = require('webpack');

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
                ]
            },
            {
                exclude: /node_modules/,
                test: /\.js$/,
                loaders: ['babel-loader']
            },
            {
                exclude: /node_modules/,
                test: /\.pug/,
                loaders: ['pug-loader']
            },
            {
                exclude: /node_modules/,
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-index.pug',
            filename: 'index.html',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-index.pug',
            filename: 'wp-content/themes/twentyseventeen/index.php',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-osnovi.pug',
            filename: 'osnovi.html',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-osnovi.pug',
            filename: 'wp-content/themes/twentyseventeen/osnovi.php',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-header.pug',
            filename: 'wp-content/themes/twentyseventeen/header.php',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-schedule.pug',
            filename: 'wp-content/themes/twentyseventeen/schedule.php',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-schedule.pug',
            filename: 'schedule.html',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-feedback.pug',
            filename: 'wp-content/themes/twentyseventeen/feedback.php',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-feedback.pug',
            filename: 'feedback.html',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-success.pug',
            filename: 'wp-content/themes/twentyseventeen/success.php',
            inject: 'head'
        }),
        new HtmlWebpackPlugin({
            title: 'IT-Center',
            template: 'src/wp-success.pug',
            filename: 'success.html',
            inject: 'head'
        }),
        new ForkTsCheckerWebpackPlugin({
            async: false,
            watch: 'src',
            tsconfig: './tsconfig.json',
            // tslint: './tslint.json',
        }),
        new CopyWebpackPlugin([
            {from: 'src/fonts', to: 'fonts'},
            {from: 'src/images', to: 'images'},
            {from: 'src/svg', to: 'svg'}
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'libraries'
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json', 'pug']
    }
};