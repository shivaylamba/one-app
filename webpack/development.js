/* eslint-disable import/no-extraneous-dependencies */

import path from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import Server from 'webpack-dev-server/lib/Server';

const devServerConfig = {
  publicPath: 'http://localhost:3001/dist',
  contentBase: path.resolve(__dirname, '..'),
  contentBasePublicPath: '/',
  index: 'index.html',
  compress: true,
  port: 3001,
  hot: true,
  inline: true,
  stats: 'minimal',
  open: {
    app: ['Google Chrome', '--incognito'],
  },
  // leave server for reminder for parrot integration
  // eslint-disable-next-line no-unused-vars
  // before: (app, server) => {
  //   app.get('/', (req, res) => {
  //     res
  //       .status(200)
  //       .type('html')
  //       .sendFile(path.resolve(process.cwd(), 'index.html'));
  //   });
  // },
};

function startDevServer(options = { ...devServerConfig }) {
  // eslint-disable-next-line global-require
  const config = merge(require('../webpack.config.js'), {
    devServer: options || { ...devServerConfig },
  });
  config.output.publicPath = config.devServer.publicPath;
  config.plugins.unshift(new webpack.HotModuleReplacementPlugin());

  const compiler = webpack(config);

  const { host = 'localhost', port = 8080, socket } = config.devServer;

  const server = new Server(compiler, {
    ...config.devServer,
    host,
    port,
    socket,
  });

  server.listen(port, host, err => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log('Webpack dev server listening on port:', port);
  });

  return server;
}

async function watchBuild({ aggregateTimeout = 300, pollInterval = 1000 }) {
  // eslint-disable-next-line global-require
  const compiler = webpack(require('./app'));
  const watcher = await new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let watcherHandle = compiler.watch(
      {
        aggregateTimeout,
        poll: pollInterval,
      },
      // eslint-disable-next-line no-unused-vars
      (err, stats) => {
        if (err) reject(err);
        else {
          // console.log(stats);
          resolve(watcherHandle);
        }
      }
    );
  });
  return watcher;
}

if (module === require.main) {
  (async function start() {
    startDevServer();
  })();
} else {
  exports.startDevServer = startDevServer;
  exports.watchBuild = watchBuild;
}
