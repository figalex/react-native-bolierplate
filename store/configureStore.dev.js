import { applyMiddleware, compose, createStore } from 'redux';
import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';

import DevTools from '../DevTools';
import createReducer from '../Reducers';
import persistenceStore from './persistence/store';

function getDebugSessionKey() {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length > 0) ? matches[1] : null;
}

const finalCreateStore = compose(
  applyMiddleware(thunk),
  persistenceStore,
  DevTools.instrument(),
  persistState(getDebugSessionKey())
)(createStore);

function configureStore(initialState) {

  const store = finalCreateStore(createReducer(), initialState);
  store.asyncReducers = {};

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('../Reducers/index.js', () => {
      const nextRootReducer = require('../Reducers').default;

      store.replaceReducer(nextRootReducer());
    });
  }

  return store;
}


function injectAsyncReducer (store, name, asynReducer) {
  store.asyncReducers[name] = asynReducer;
  store.replaceReducer(createReducer(store.asyncReducers));
}

export default {
  configureStore: configureStore,
  injectAsyncReducer: injectAsyncReducer
};
