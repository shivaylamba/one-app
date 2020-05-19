// eslint-disable-next-line import/no-extraneous-dependencies
const TerserPlugin = require('terser-webpack-plugin');

const { isDevelopment } = require('./common');

// eslint-disable-next-line camelcase
module.exports = ({ isDev = isDevelopment(), keep_fnames = true } = {}) => ({
  devtool: isDev && 'eval-cheap-source-map',
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        test: /\.jsx?$/i,
        terserOptions: {
          keep_fnames,
        },
      }),
    ],
  },
});
