const path = require('path')
const webpack = require('webpack')
const { getIfUtils } = require('webpack-config-utils')
const { ifProd } = getIfUtils(process.env.NODE_ENV)
const fs = require('fs')

module.exports = () => {
  // replace old config for dev/prod servers
  try {
    let data = fs.readFileSync(`./src/configs/config-${process.env.NODE_ENV}.js`, 'utf8')
    let adjData = data.replace(`-${process.env.NODE_ENV}`, '')
    fs.writeFileSync(`./src/configs/config.js`, adjData)
  } catch (err) {
    console.error(err)
  }
  return {
    context: path.join(__dirname, '/src'),
    entry: './app.js',
    devtool: ifProd(false, 'source-maps'),
    output: {
      path: path.join(__dirname, '/dist'),
      filename: 'bundle.js'
    },
    watch: true,
    watchOptions: {
      poll: true
    },
    devServer: {
      hot: true,
      historyApiFallback: true,
      inline: true,
      contentBase: './dist',
      host: '0.0.0.0',
      port: 8080,
      disableHostCheck: true
    },
    resolve: {
      extensions: ['.js', '.json']
    },
    stats: {
      colors: true,
      reasons: true,
      chunks: true
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.js$/,
          loader: 'eslint-loader',
          include: path.join(__dirname, '/src')
        },
        {
          exclude: /node_modules/,
          test: /\.js$/,
          loaders: ['babel-loader']
        },
        {
          exclude: /node_modules/,
          test: /\.scss$/,
          loaders: ['style-loader', 'scss-loader', 'sass-loader']
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  }
}
