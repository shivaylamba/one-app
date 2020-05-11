// /* eslint-disable import/no-extraneous-dependencies */

// const path = require('path');
// const webpack = require('webpack');
// const TerserPlugin = require('terser-webpack-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// const nodeEnvIsProduction = process.env.NODE_ENV === 'production';

// const packageRoot = process.cwd();
// const mainFields = ['module', 'browser', 'main'];

// const externalsMap = {
//   '@americanexpress/one-app-ducks': {
//     var: 'OneAppDucks',
//     commonjs2: '@americanexpress/one-app-ducks',
//   },
//   '@americanexpress/one-app-router': {
//     var: 'OneAppRouter',
//     commonjs2: '@americanexpress/one-app-router',
//   },
//   'create-shared-react-context': {
//     var: 'CreateSharedReactContext',
//     commonjs2: 'create-shared-react-context',
//   },
//   holocron: {
//     var: 'Holocron',
//     commonjs2: 'holocron',
//   },
//   'holocron-module-route': {
//     var: 'HolocronModuleRoute',
//     commonjs2: 'holocron-module-route',
//   },
//   immutable: {
//     var: 'Immutable',
//     commonjs2: 'immutable',
//   },
//   redux: {
//     var: 'Redux',
//     commonjs2: 'redux',
//   },
//   reselect: {
//     var: 'Reselect',
//     commonjs2: 'reselect',
//   },
//   react: {
//     var: 'React',
//     commonjs2: 'react',
//   },
//   'react-dom': {
//     var: 'ReactDOM',
//     commonjs2: 'react-dom',
//   },
//   'react-redux': {
//     var: 'ReactRedux',
//     commonjs2: 'react-redux',
//   },
//   'react-helmet': {
//     var: 'ReactHelmet',
//     commonjs2: 'react-helmet',
//   },
//   'prop-types': {
//     var: 'PropTypes',
//     commonjs2: 'prop-types',
//   },
// };

// const externals = Object.keys(externalsMap);
// const externalsRegExp = new RegExp(
//   `(${externals.join('|')}).*`.replace('/', '\\/'),
//   'i'
// );
// const externalsLoaders = externals.map((key) => ({
//   test: new RegExp(`(${key.replace('/', '\\/')}).*`),
//   use: {
//     loader: 'expose-loader',
//     options: externalsMap[key].var,
//   },
// }));

// const outputDirPath = path.resolve(packageRoot, 'build/app');

// module.exports = () => [
//   // {
//   //   entry: { externals },
//   //   output: {
//   //     path: outputDirPath,
//   //     filename: '[name].dll.js',
//   //   },
//   //   plugins: [
//   //     new webpack.DllPlugin({
//   //       context: __dirname,
//   //       name: '[name]_[hash]',
//   //       path: path.join(__dirname, '.webpack.manifest.json'),
//   //     }),
//   //   ],
//   // },
//   {
//     mode: nodeEnvIsProduction ? 'production' : 'development',
//     entry: {
//       app: './src/client/client',
//     },
//     output: {
//       path: outputDirPath,
//       filename: '[name].js',
//     },
//     plugins: [
//       new webpack.DefinePlugin({
//         'global.BROWSER': JSON.stringify(true),
//       }),
//       new webpack.EnvironmentPlugin(['NODE_ENV']),
//       // new webpack.DllReferencePlugin({
//       //   context: __dirname,
//       //   // eslint-disable-next-line global-require
//       //   manifest: require('./.webpack.manifest.json'),
//       //   // scope: 'xyz',
//       //   sourceType: 'commonjs2',
//       // }),
//       new BundleAnalyzerPlugin(),
//     ],
//     resolve: {
//       alias: {
//         'transit-js': path.resolve(packageRoot, 'src/universal/vendors/transit-amd-min.js'),
//       },
//       extensions: ['.js', '.jsx'],
//       mainFields,
//       modules: [packageRoot, 'node_modules'],
//     },
//     module: {
//       rules: [
//         ...externalsLoaders,
//         {
//           test: /\.jsx?$/,
//           use: 'babel-loader',
//         },
//       ],
//     },
//     optimization: {
//       usedExports: true,
//       // innerGraph: true,
//       sideEffects: true,
//       removeAvailableModules: true,
//       concatenateModules: true,
//       runtimeChunk: false,
//       splitChunks: {
//         chunks(chunk) {
//           return ['service-worker-client'].includes(chunk.name) !== true;
//         },
//         // minChunks: Infinity,
//         // maxSize: 0,
//         maxAsyncRequests: 6,
//         maxInitialRequests: 4,
//         automaticNameDelimiter: '~',
//         cacheGroups: {
//           externals: {
//             test: externalsRegExp,
//             priority: 20,
//             enforce: true,
//           },
//           vendors: {
//             test: /[\\/]node_modules[\\/]|transit/,
//             priority: -20,
//             reuseExistingChunk: true,
//           },
//         },
//       },
//       minimize: nodeEnvIsProduction,
//       minimizer: [
//         new TerserPlugin({
//           test: /\.jsx?$/i,
//           extractComments: false,
//           terserOptions: {
//             compress: {
//               drop_console: true,
//             },
//             keep_fnames: true,
//           },
//         }),
//       ],
//     },
//     // externals,
//   },
// ];

module.exports = require('./app');
