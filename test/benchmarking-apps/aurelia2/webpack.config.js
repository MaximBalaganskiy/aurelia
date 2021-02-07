const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseUrl = '/';

module.exports = function () {
  return {
    mode: 'development', // 'production',
    devtool: false,
    entry: './src/main.ts',
    resolve: {
      extensions: ['.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      mainFields: ['module'],
      // sadly these fallbacks are required to run the app via webpack-dev-server
      fallback: {
        'html-entities': require.resolve('html-entities/'),
        'url': require.resolve('url/'),
        'events': require.resolve('events/'),
      },
    },
    devServer: {
      historyApiFallback: true,
    },
    output: {
      publicPath: baseUrl,
    },
    module: {
      rules: [
        { test: /\.css$/i, use: [{ loader: 'style-loader' }, { loader: 'css-loader' }] },
        { test: /\.ts$/i, use: 'ts-loader', exclude: /node_modules/ },
        { test: /\.html$/i, use: 'html-loader' },
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.ejs' }),
    ]
  };
};
