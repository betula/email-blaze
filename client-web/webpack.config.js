const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const isDev = process.env.NODE_ENV !== 'production';

const config = {
  mode: isDev ? 'development' : 'production',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build/public'),
    publicPath: '/',
  },
  devtool: isDev ? 'inline-source-map' : false,
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ],
      },
    ],
  },
  stats: {
    logging: 'warn',
    modules: false,
  },
};

const clientConfig = {
  ...config,
  target: 'web',
  entry: {
    browser: './src/browser.tsx',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/favicon.png'
    }),
  ],

  ...(isDev ? {
    devServer: {
      port: 3000
    }
  } : void 0)
};

module.exports = clientConfig;
