// loaders

const createBabelLoader = ({ isDev }) => ({
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

module.exports = ({ isDev }) => ({
  module: {
    rules: [createBabelLoader({ isDev })],
  },
});
