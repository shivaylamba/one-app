import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import buble from '@rollup/plugin-buble';
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';

import pkg from './package.json';

const debug = true;

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
  .concat(
    'perf_hooks',
    'path',
    'fs',
    'http',
    'https',
    'util',
    'url',
    'url/url',
    'os'
  );

export default {
  input: 'src/server/index.js',
  output: {
    dir: 'lib',
    format: 'cjs',
    hoistTransitiveImports: false,
    externalLiveBindings: false,
    compact: true,
    esModule: false,
    preferConst: true,
  },
  perf: true,
  preserveModules: true,
  external,
  plugins: [
    replace({ 'process.env.NODE_ENV': '"production"' }),
    resolve({
      preferBuiltins: true,
      extensions: ['.js', '.jsx'],
    }),
    commonjs({
      ignore: (id) => {
        // return true;
        if (debug) console.log(id, /@americanexpress|node_modules|url/g.test(id) || external.includes(id));
        return /@americanexpress|node_modules|url/g.test(id) || external.includes(id);
      },
      include: /src/,
    }),
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
    babel(),
    cleanup(),
  ],
};
