module.exports = ({ isDev, alias, modules = [] }) => ({
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.mjs'],
    mainFields: ['module', 'main', 'browser'],
    modules: [].concat(modules, 'node_modules'),
    alias: {
      // eslint-disable-next-line no-extra-parens
      ...(alias || {}),
      // eslint-disable-next-line no-extra-parens
      ...(isDev ? {
        'react-dom': '@hot-loader/react-dom',
      } : {}),
    },
  },
});
