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

import React, { StrictMode } from 'react';
import PropTypes from 'prop-types';
// import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import { createHolocronStore } from 'holocron';
// import { ReduxMock } from 'react-cosmos-redux';
import { FixtureContext } from 'react-cosmos/fixture';

import reducer from '../../src/universal/reducers';

export function createStore({ activeLocale = 'en-US', rootModuleName } = {}) {
  const store = createHolocronStore({
    reducer,
    initialState: fromJS({
      intl: {
        activeLocale,
      },
      config: {
        rootModuleName,
      },
    }),
    extraThunkArguments: {
      fetchClient: fetch,
    },
  });

  return store;
}

const store = createStore();
export default function OneAppDecorator({ children }) {
  const { setFixtureState } = React.useContext(FixtureContext);
  React.useEffect(() => {
    setFixtureState({ store });
  }, []);
  return (
    <StrictMode>
      {children}
    </StrictMode>
  );
}

OneAppDecorator.propTypes = {
  children: PropTypes.node,
};

OneAppDecorator.defaultProps = {
  children: null,
};
