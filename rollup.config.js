import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json';

const external = []
  .concat(
    Object.keys(pkg.dependencies),
    Object.keys(pkg.devDependencies),
    Object.keys(pkg.optionalDependencies)
  )
  .concat(
    'lean-intl/locale-data/json/en.json',
    '@americanexpress/vitruvius/immutable',
    'babel-preset-amex/browserlist',
    'holocron/loadModule.node',
    'holocron/moduleRegistry',
    'holocron/ducks/constants',
    'holocron/server',
    'react-dom/server',
    'uuid/v4'
  )
  .concat('perf_hooks', 'path', 'fs', 'http', 'https', 'util', 'url', 'url/url', 'os')
  .filter((name) => ['cross-fetch', 'regenerator-runtime'].includes(name) === false);

export default [
  {
    input: [
      // 'regenerator-runtime/runtime',
      // 'cross-fetch',
      'src/server/index.js',
      'src/server/utils/logging/development-formatters/index.js',
      'src/server/utils/logging/development-formatters/verbose.js',
      'src/server/utils/logging/development-formatters/friendly.js',
    ],
    // input: {
    //   // app: ['regenerator-runtime/runtime', 'src/server/index.js'],
    //   app: 'src/server/index.js',
    //   log: 'src/server/utils/logging/development-formatters/index.js',
    // },
    output: {
      dir: 'lib',
      format: 'cjs',
      // hoistTransitiveImports: true,
      // externalLiveBindings: true,
      // compact: true,
      // esModule: false,
      preferConst: true,
    },
    perf: true,
    preserveModules: true,
    external,
    plugins: [
      replace({ 'process.env.NODE_ENV': '"production"' }),
      resolve({
        preferBuiltins: true,
        jail: require('path').resolve(__dirname, 'src'),
        extensions: ['.js', '.jsx'],
        dedupe: ['cross-fetch', 'regenerator-runtime'],
      }),
      // commonjs({
      //   // ignore: (id) => {
      //   //   // return true;
      //   //   if (debug) {
      //   //     console.log(id, /@americanexpress|node_modules|url/g.test(id) || external.includes(id));
      //   //   }
      //   //   return /@americanexpress|node_modules|url/g.test(id) || external.includes(id);
      //   // },
      //   exclude: /node_modules|cross-fetch/,
      //   include: [
      //     // include using a glob pattern (either a string or an array of strings)
      //     'src/server/utils/logging/development-formatters/*.js',
      //   ],
      // }),
      buble({
        transforms: {
          arrow: false,
          forOf: false,
          asyncAwait: false,
          defaultParameter: false,
          letConst: false,
          templateString: false,
          destructuring: false,
          parameterDestructuring: false,
          computedProperty: false,
        },
        objectAssign: 'Object.assign',
      }),
      // babel(),
      cleanup(),
    ],
  },
];
