/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

const {
  isDevelopment,
  getContext,
  getOutputPath,
  getWorkingPath,
} = require('./common');

module.exports = ({
  dllAsReference = false,
  dllName = 'vendors',
  dllPath = getWorkingPath(`.${dllName}.dll.json`),
  dllVendors = [
    '@americanexpress/one-app-ducks',
    '@americanexpress/one-app-router',
    'create-shared-react-context',
    'holocron',
    'holocron-module-route',
    'immutable',
    'redux',
    'reselect',
    'react',
    'react-dom',
    'react-redux',
    'react-helmet',
    'prop-types',
  ],
} = {}) => ({
  // eslint-disable-next-line no-extra-parens
  ...(dllAsReference
    ? {}
    : {
      mode: isDevelopment() ? 'development' : 'production',
      entry: { [dllName]: dllVendors },
      output: {
        path: getOutputPath(),
        filename: '[name].js',
        library: dllName,
      },
      optimization: {
        minimize: !isDevelopment(),
        minimizer: [
          new TerserPlugin({
            test: /\.jsx?$/i,
            terserOptions: {
              keep_fnames: true,
            },
          }),
        ],
      },
    }),
  plugins: dllAsReference
    ? [
      new webpack.DllReferencePlugin({
        context: getContext(),
        name: dllName,
        manifest: dllPath,
      }),
    ]
    : [
      new webpack.DllPlugin({
        context: getContext(),
        name: dllName,
        path: dllPath,
      }),
    ],
});
