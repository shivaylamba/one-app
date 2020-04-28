[👈 Return to Overview](./Recipes.md)

# Mocking your API calls for Local Development


1. Setup the API using [making an API guide](../../recipes/Making-An-API-Call.md). The API call would be similar to this

    ```javascript
    const loadModuleData = async ({ store, fetchClient }) => {
      const moduleState = store.getState().getIn(['modules', 'my-first-module']);
      const fastRes = await fetchClient(store.getState().getIn(['config', 'someApiUrl']));
      const data = await fastRes.json();
    };
    ```

   The `someApiUrl` above is setup within the `appConfig` of the module. Check out the [One App configurations guide to learn how to set this up](../modules/App-Configuration.md#provideStateConfig).

2. Configure the Parrot scenarios. When modules are generated using [One App module generator](https://github.com/americanexpress/one-app-cli/tree/master/packages/generator-one-app-module) a mock folder is created, this contains sample scenarios.

   > 🐦 Parrot is a set of tools that allow you to create HTTP mocks and organize them into scenarios in order to develop your app against different sets of data

    ```
    module
    ├── README.md
    ├── mock
    |   └── scenarios.js
    |
    ├── package.json
    └── src
        └── index.js
    ```

   Update the file to accommodate all the scenarios that you'd like to mock using Parrot. Refer to [Parrot scenarios](https://github.com/americanexpress/parrot/blob/master/SCENARIOS.md) to learn how you can setup different scenarios.

3. Set up the `dev-middleware.js` and `dev.endpoints.js`.
  
   - `dev-middleware.js`
  
   A `dev-middleware.js` file allows you to setup a custom middleware configuration. This file is created by default when [One App module generator](https://github.com/americanexpress/one-app-cli/tree/master/packages/generator-one-app-module) is used in generating the module. Ensure that [`parrot-middleware`](https://github.com/americanexpress/parrot/tree/master/packages/parrot-middleware) is installed.

   **Running within One App.**

   Use the `set-middleware` command to link your module's custom dev middleware file to One App

    ```bash
    npm run set-middleware [path-to-your-module]/dev.middleware.js
    ```

   **Running with One App runner**

    When using [one-app-runner](https://github.com/americanexpress/one-app-cli/tree/master/packages/one-app-runner), this can be setup within the package.json as follows:
  
    ```json
    "one-amex": {
    "runner": {
    "parrotMiddleware": "[path-to-your-module]/dev.middleware.js"
    },
    }
    ```

    The file `dev-middleware.js` contains the following parrot configurations.

    ```javascript
    const parrot = require('parrot-middleware');
    const scenarios = require('./mock/scenarios');

    module.exports = (app) => app.use(parrot(scenarios));
    ```

   - `set-dev-endpoints.js`

   A `dev.endpoints.js` file contains all the information One App needs to configure [one-app-dev-proxy](https://github.com/americanexpress/one-app-dev-proxy)
   (our reverse proxy and mocking server that runs during development) and can be used to set remote endpoints
   for your Module to use during local development. Create this file within the root folder of your module.

   **Running within One App.**

   Use the `set-dev-endpoints` command to link your module's dev endpoints file to One App.

   ```bash
    npm run set-dev-endpoints [path-to-your-module]/dev.endpoints.js
   ```

   **Running with One App runner**

   When using [one-app-runner](https://github.com/americanexpress/one-app-cli/tree/master/packages/one-app-runner), this can be setup within the package.json as follows:
  
    ```json
    "one-amex": {
    "runner": {
    "devEndpoints": "[path-to-your-module]/dev.endpoints.js"
    },
    }
    ```

   A `dev.endpoints.js` file contains the following:

   ```js
   module.exports = () => ({
     apiUrl: {
       devProxyPath: 'someApiUrl',
       destination: 'https://example.com',
     },

   });
    ```

4. Start One App using the below command, this will allow the application to start with `one-app-dev-proxy` custom configurations setup above.

    ```bash
    npm start -- --root-module-name=<module-name> --use-middleware
    # e.g. npm start -- --root-module-name=my-first-module --use-middleware
    ```

5. Install the [Parrot Chrome extension](https://chrome.google.com/webstore/detail/parrot-devtools/jckchajdleibnohnphddbiglgpjpbffn) to switch between different scenarios, you can also view the scenarios by visiting [http://localhost:3002/parrot/scenarios](http://localhost:3002/parrot/scenarios)

**📘 More Information**

* [parrot-middleware](https://github.com/americanexpress/one-app-cli/tree/master/packages/one-app-runner#parrot-middleware-optional)
* [dev-endpoints](https://github.com/americanexpress/one-app-cli/tree/master/packages/one-app-runner#dev-endpoints-optional)


[☝️ Return To Top](#mocking-your-api-calls-for-local-development)
