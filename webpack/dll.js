/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const merge = require('webpack-merge');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const {
  isDevelopment,
  getContext,
  getOutputPath,
  getWorkingPath,
} = require('./common');
const externals = require('./externals');
const createMinifyConfig = require('./minify');

module.exports = ({
  isDev = isDevelopment(),
  dllAsReference = false,
  dllName = 'vendors',
  dllPath = getWorkingPath(`.${dllName}.dll.json`),
  dllVendors = externals,
} = {}) => ({
  // eslint-disable-next-line no-extra-parens
  ...(dllAsReference
    ? {}
    : merge(
      createMinifyConfig({ isDev }),
      {
        mode: isDev ? 'development' : 'production',
        entry: { [dllName]: dllVendors },
        output: {
          path: getOutputPath(),
          filename: '[name].js',
          library: dllName,
        },
      }
    )),
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
      new BundleAnalyzerPlugin(),
    ],
});
