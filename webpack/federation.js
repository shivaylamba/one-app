// eslint-disable-next-line import/no-extraneous-dependencies
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

const externals = require('./externals');

const exposedExports = {
  AppContext: 'src/universal/context',
};

module.exports = ({
  name = 'one_app',
  namespace = 'oneApp',
  modules = {},
  shared = externals,
  exposes = exposedExports,
}) => ({
  plugins: [
    // https://dev.to/marais/webpack-5-and-module-federation-4j1i
    new ModuleFederationPlugin({
      name,
      library: { type: 'global', name: namespace },
      // modules/roots: {}
      // app_one: 'app_one',
      // app_three: 'app_three',
      remotes: modules,
      // exposed from the build for global consumption,
      // under the namespace
      exposes,
      // externals:
      shared,
    }),
  ],
});
