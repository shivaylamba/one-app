/* eslint-disable global-require, import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const createDLLConfig = require('./dll');
const createMinifyConfig = require('./minify');
const createModuleLoadersConfig = require('./module-loaders');
const createResolveConfig = require('./resolve');
const {
  isDevelopment,
  getContext,
  getOutputPath,
} = require('./common');

const isDev = isDevelopment();
const context = getContext();

module.exports = merge(
  createDLLConfig({ isDev, dllAsReference: true }),
  createMinifyConfig({ isDev }),
  createModuleLoadersConfig({ isDev }),
  createResolveConfig({
    isDev,
    alias: {
      'transit-js': path.resolve(context, 'src/universal/vendors/transit-amd-min.js'),
    },
  }),
  {
    profile: true,
    mode: isDev ? 'development' : 'production',
    context,
    entry: {
      app: [].concat(isDev ? ['react-hot-loader/patch'] : [], path.resolve(context, 'src/client/client')),
    },
    output: {
      path: getOutputPath(),
      filename: '[name].js',
      publicPath: '/dist/',
    },
    optimization: {
      runtimeChunk: 'single',
    },
    plugins: [
      new webpack.DefinePlugin({
        'global.BROWSER': JSON.stringify(true),
      }),
      new webpack.EnvironmentPlugin(['NODE_ENV']),
      new BundleAnalyzerPlugin(),
    ],
  }
);
