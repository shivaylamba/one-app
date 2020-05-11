const path = require('path');

exports.isDevelopment = function isDevelopment() {
  return process.env.NODE_ENV === 'development';
};

exports.getContext = function getContext() {
  return process.cwd();
};

exports.getWorkingPath = function getWorkingPath(fileName = '') {
  return path.resolve(process.cwd(), fileName);
};

exports.getOutputPath = function getOutputPath(fileName = '') {
  return path.resolve(process.cwd(), 'dist', fileName);
};

exports.createBabelLoader = ({ isDev }) => ({
  test: /\.jsx?$/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: isDev,
      },
    },
  ],
});
