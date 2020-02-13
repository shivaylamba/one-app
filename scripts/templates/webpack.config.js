const oneAppBundlerConfig = require('@americanexpress/one-app-bundler/webpack/app/webpack.client');

function createCosmosWebpackConfigFromBundler(env = 'development') {
  const cwd = process.cwd();
  const config = oneAppBundlerConfig(env);

  const [files, woff, , jsx, css, ...externals] = config.module.rules;

  jsx.include.push(`${cwd}/prod-sample`);
  jsx.include.push(`${cwd}/static`);

  config.module.rules = [
    files, woff, jsx, css,
  ].concat(externals);

  return config;
}

module.exports = createCosmosWebpackConfigFromBundler();
