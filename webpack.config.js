const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'snake': './src/index'
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './public'),
    publicPath: '/'
  },
  module: {
    rules: [
      { 
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: [
            {
                loader: require.resolve('babel-loader'),
                query: {
                    presets: [
                        require.resolve('babel-preset-env'),
                    ]
                }
            }
        ]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    query: {
                        modules: true,
                        localIdentName: '[name]__[local]__[hash:base64:5]',
                        context: './'
                    }
                }
            ]
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin()
  ],
  devServer: {
    port: 8080,
    historyApiFallback: true,
    disableHostCheck: true,
    open: true
  }
}
