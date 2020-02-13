/*
 * Copyright 2019 American Express Travel Related Services Company, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const { mkdir } = require('./utils');

// directories
const cwd = process.cwd();
const basePath = 'static';
const modulesPath = 'modules';
const fixturesPath = '__fixtures__';
// files
const decoratorPath = 'cosmos.decorator.js';
const moduleMapPath = 'module-map.json';
const cosmosConfigPath = 'cosmos.config.json';
// config
const defaultBundleType = 'browser';

const paths = {
  base: basePath,
  modules: modulesPath,
  fixtures: fixturesPath,
  moduleMap: moduleMapPath,
  cosmosConfig: cosmosConfigPath,
  decorator: decoratorPath,
};
const templates = {
  fixture: path.normalize(`${__dirname}/templates/cosmos.fixture.jsx`),
  decorator: `${__dirname}/templates/cosmos.decorator.jsx`,
};

function normalizePath(pathName, base = cwd) {
  return path.normalize(path.join(base, pathName));
}
function readFile(pathName, parse = true, base = cwd) {
  const content = fs.readFileSync(normalizePath(pathName, base)).toString();
  return parse ? JSON.parse(content) : content;
}
function writeFile(pathName, value, stringify = true) {
  return fs.writeFileSync(
    pathName,
    stringify ? JSON.stringify(value, null, 2) : value
  );
}
function loadFile(pathToFile, {
  defaultValue,
  json = false,
  base,
}) {
  if (fs.existsSync(pathToFile)) return readFile(pathToFile, json, base);
  if (defaultValue) writeFile(pathToFile, defaultValue, json);
  return defaultValue;
}
function loadTemplate(templateName, template = '') {
  const templatePath = templates[templateName];
  return templatePath ? loadFile(templatePath, {
    defaultValue: template,
    json: false,
    base: '',
  }) : template;
}

function getModulesSourcePath() {
  return `${cwd}/prod-sample/sample-modules`;
}
function getWebpackConfigPath() {
  return '../scripts/templates/webpack.config';
}
function getCosmosConfigPath() {
  return `${paths.base}/${paths.cosmosConfig}`;
}
function getModuleMapPath() {
  return `${paths.base}/${paths.moduleMap}`;
}
function getDecoratorPath() {
  return `${paths.base}/${paths.decorator}`;
}
function getModulesPath(moduleName) {
  return [`${paths.base}/${paths.modules}`, moduleName || ''].join(moduleName ? '/' : '');
}
function getFixturesPath(moduleName) {
  return [`${paths.base}/${paths.fixtures}`, moduleName || ''].join(moduleName ? '/' : '');
}
function getModulePath(moduleName, moduleVersion, bundleType = defaultBundleType) {
  return `${getModulesPath()}/${moduleName}/${moduleVersion}/${moduleName}.${bundleType}.js`;
}
function getModuleFixturePath(moduleName, moduleVersion, bundleType = defaultBundleType) {
  return `${getFixturesPath()}/${moduleName}/${moduleVersion}.${bundleType}.jsx`;
}
function getModuleVersionFromURL(moduleName, url) {
  return url.replace(new RegExp(`/${moduleName}|integration|qa(?:[/.])`, 'gi'), '///').split('///')[1].replace('/', '');
}

function getDefaultModuleMap() {
  return {
    key: 'module-viewer',
    modules: {},
  };
}
function getDefaultCosmosConfig() {
  // https://github.com/react-cosmos/react-cosmos/blob/master/packages/react-cosmos/config.schema.json
  return {
    staticPath: '.',
    fixtures: [getFixturesPath()],
    watchDirs: [paths.base],
    webpack: {
      configPath: getWebpackConfigPath(),
    },
  };
}

function extractModulesFromModuleMap(moduleMap, bundleType) {
  return Object.keys(moduleMap.modules)
    .map((moduleName) => {
      const {
        [bundleType]: {
          url,
        },
      } = moduleMap.modules[moduleName];
      const moduleVersion = getModuleVersionFromURL(moduleName, url);
      return {
        moduleName,
        moduleVersion,
        fixturePath: getModuleFixturePath(moduleName, moduleVersion, bundleType),
        modulePath: getModulePath(moduleName, moduleVersion, bundleType),
      };
    });
}

function createFixtures({
  moduleMap,
  bundleType,
  moduleSource,
  moduleBuild,
  fixtureTemplate = loadTemplate('fixture'),
}) {
  const fixture = fixtureTemplate.replace(
    '// eslint-disable-next-line import/no-unresolved, import/extensions\n', '');
  extractModulesFromModuleMap(moduleMap, bundleType)
    .forEach(({
      moduleName,
      moduleVersion,
      fixturePath,
    }) => {
      mkdir(normalizePath(getFixturesPath(moduleName)));
      // don't overwrite if it exists
      if (fs.existsSync(fixturePath) === false) {
        writeFile(
          fixturePath,
          fixture
            .replace('[module-base]', moduleSource || moduleBuild)
            .replace('moduleName', moduleName)
            .replace('moduleVersion', moduleVersion)
            .replace('moduleName.bundleType', moduleSource ? 'src/index' : [moduleName,
              bundleType,
            ].join('.')),
          false
        );
      }
    });
}

function createDecorator({
  moduleMap,
  decoratorTemplate = loadTemplate('decorator'),
}) {
  writeFile(
    normalizePath(getDecoratorPath()),
    [
      `window.__CLIENT_HOLOCRON_MODULE_MAP__ = ${JSON.stringify(moduleMap).replace(new RegExp(/\[one-app-dev-cdn-url\]\/static\//, 'g'), '/')};`,
      decoratorTemplate.replace('../../src', '../src'),
    ].join('\n\n'),
    false
  );
}

function generateFixtures({
  moduleMap,
  bundleType,
  moduleSource,
  moduleBuild = '../../modules',
}) {
  const {
    fixtureTemplate = loadTemplate('fixture'),
    decoratorTemplate = loadTemplate('decorator'),
    fixturesDirPath = normalizePath(getFixturesPath()),
  } = {};
  mkdir(fixturesDirPath);
  createDecorator({
    moduleMap,
    decoratorTemplate,
  });
  createFixtures({
    moduleMap,
    bundleType,
    moduleSource,
    moduleBuild,
    fixtureTemplate,
  });
}

(function moduleViewer({
  buildMode, watchMode, bundleType, customPaths,
}) {
  if (customPaths) Object.assign(paths, customPaths);

  const {
    moduleMap = loadFile(
      getModuleMapPath(), {
        json: true,
        defaultValue: getDefaultModuleMap(),
      }
    ),
  } = {};

  generateFixtures({
    moduleMap,
    bundleType,
    moduleSource: getModulesSourcePath(),
  });

  if (buildMode === false) {
    if (watchMode) {
      // TODO: watch module map for change and regenerate fixtures
    }

    const cosmosPath = getCosmosConfigPath();

    loadFile(
      cosmosPath, {
        json: true,
        defaultValue: getDefaultCosmosConfig(),
      }
    );

    const cmd = `npm run cosmos -- --config ${cosmosPath}`;
    execSync(cmd, { stdio: 'inherit' });
  }
}({
  bundleType: 'browser',
  rootModuleName: 'frank-lloyd-root',
  preloadModules: [
    'frank-lloyd-root',
  ],
  buildMode: false,
  watchMode: false,
}));
