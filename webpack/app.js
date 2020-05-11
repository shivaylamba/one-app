/* eslint-disable global-require, import/no-extraneous-dependencies */

const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const createDLLConfig = require('./dll');
const { isDevelopment, createBabelLoader } = require('./common');

const isDev = isDevelopment();
const mode = isDev ? 'development' : 'production';

const context = process.cwd();
const packagesPath = path.resolve(context, 'packages');
const distPath = path.resolve(context, 'dist');
const resolve = {
  extensions: ['.js', '.jsx'],
  mainFields: ['module', 'main', 'browser'],
  modules: [packagesPath, 'node_modules'],
  alias: {
    'transit-js': path.resolve(context, 'src/universal/vendors/transit-amd-min.js'),
  },
};

const plugins = [
  new webpack.DefinePlugin({
    'global.BROWSER': JSON.stringify(true),
  }),
  new webpack.EnvironmentPlugin(['NODE_ENV']),
  // https://dev.to/marais/webpack-5-and-module-federation-4j1i
  new ModuleFederationPlugin({
    name: 'app_externals',
    library: { type: 'global', name: 'app_externals' },
    remotes: {
      // modules/roots:-
      // app_one: 'app_one',
      // app_three: 'app_three',
    },
    // exposes: {
    //   AppContext: 'src/universal/context',
    // },
    // externals:-
    shared: require('./externals'),
  }),
];

let devtool = false;
if (isDev) {
  devtool = 'eval-cheap-source-map';
  resolve.alias = {
    'react-dom': '@hot-loader/react-dom',
  };
}

module.exports = merge(createDLLConfig({ dllAsReference: true, isDev }), {
  profile: true,
  mode,
  context,
  devtool,
  entry: {
    app: [].concat(isDev ? ['react-hot-loader/patch'] : [], path.resolve(context, 'src/client/client')),
  },
  output: {
    path: distPath,
    filename: '[name].js',
    publicPath: '/dist/',
  },
  resolve,
  module: {
    rules: [createBabelLoader({ isDev })],
  },
  plugins,
  optimization: {
    runtimeChunk: 'single',
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        test: /\.jsx?$/i,
      }),
    ],
  },
});
