/*
 * Copyright 2020 American Express Travel Related Services Company, Inc.
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

import React from 'react';
import { Provider } from 'react-redux';
import { composeModules, RenderModule } from 'holocron';

import { getClientPWAConfig } from './config';
import {
  renderI18nScript, renderModuleScripts, serializeClientInitialState, modernBrowserChunkAssets,
} from '../sendHtml';
import renderModuleStyles from '../../utils/renderModuleStyles';
import { renderShell, renderInitialState, renderScriptTag } from '../../utils/renderShell';
import { getClientStateConfig } from '../../utils/stateConfig';
import { renderForStaticMarkup } from '../../utils/reactRendering';
import jsonStringifyForScript from '../../utils/jsonStringifyForScript';
import readJsonFile from '../../utils/readJsonFile';

const { buildVersion } = readJsonFile('../../../.build-meta.json');
const bundleIntegrity = readJsonFile('../../../bundle.integrity.manifest.json');

export default function createOfflineShellMiddleware() {
  const bundle = 'browser';
  const isDevelopment = process.env.NODE_ENV === 'development';

  return async function offlineShellMiddleware(req, res) {
    const { store, clientModuleMapCache } = req;
    const { scriptNonce } = res;
    const clientConfig = getClientStateConfig();
    const pwaMetaData = getClientPWAConfig();

    const cdnUrl = `${clientConfig.cdnUrl || '/_/static/'}app/${buildVersion}`;
    const rootModuleName = store.getState().getIn(['config', 'rootModuleName']);
    const activeLocale = store.getState().getIn(['intl', 'activeLocale']);

    const [app, appVendors, runtime, , vendors] = ['app.js'].concat(modernBrowserChunkAssets).map((resource) => ({
      src: `${cdnUrl}/${resource}`,
      integrity: bundleIntegrity[resource],
    })).map(({ src, integrity }) => renderScriptTag(src, [`integrity="${integrity}"`]));

    await store.dispatch(composeModules([{ name: rootModuleName }]));

    const { renderedString: appHtml, helmetInfo } = renderForStaticMarkup(
      <Provider store={store}>
        <RenderModule moduleName={rootModuleName} />
      </Provider>
    );

    const {
      htmlAttributes, bodyAttributes, base, title, meta, link, style, script, noscript,
    } = helmetInfo
      ? Object.entries(helmetInfo)
        .reduce((object, [key, value]) => ({
          ...object,
          [key]: value && typeof value === 'object' ? value.toString() : value || '',
        }), {})
      : {};

    const clientInitialState = store.getState();

    const styles = [].concat(renderModuleStyles(store), style).join('');
    const scripts = [].concat([
      appVendors,
      runtime,
      vendors,
      renderI18nScript(clientInitialState, cdnUrl),
      renderModuleScripts({
        clientInitialState,
        moduleMap: clientModuleMapCache[bundle],
        isDevelopmentEnv: isDevelopment,
        bundle,
      }),
      app,
    ], script).join('');
    const initialState = renderInitialState({
      config: {
        isDevelopment,
        scriptNonce,
      },
      // dictates if the client app should start rendering with
      // either ReactDOM method listed below
      __render_mode__: '\'render\'',
      // we expect the cdnUrl = 'https://example.com/cdn' || '/_/static/'
      // and we combine with the buildPath and add a trailing slash
      __webpack_public_path__: `'${cdnUrl}/'`,
      // we toggle between `browser` and `legacyBrowser` depending on `bundleType`
      __holocron_module_bundle_type__: '\'browser\'',
      // The client module map is derived from the original module map
      // and is expected to be stringified here, we do not wrap it in quotes
      // as we want it directly usable
      __CLIENT_HOLOCRON_MODULE_MAP__: jsonStringifyForScript(
        clientModuleMapCache.browser
      ),
      // The client initial state after it has serialized
      // the immutable state and stringified
      __INITIAL_STATE__: jsonStringifyForScript(
        serializeClientInitialState(clientInitialState)),
      // used to configure the client-side PWA initialization
      __pwa_metadata__: jsonStringifyForScript(pwaMetaData),
    }, {
      manifest: pwaMetaData.webManifestUrl ? [pwaMetaData.webManifestUrl] : null,
    });

    res
      .status(200)
      .type('html')
      .send(
        renderShell({
          lang: activeLocale,
          appHtml,
          scripts,
          styles,
          meta,
          base,
          title,
          links: link,
          htmlAttrs: htmlAttributes,
          bodyAttrs: bodyAttributes,
          noScripts: noscript,
          initialState,
        })
      );
  };
}
