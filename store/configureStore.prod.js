import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';

import DevTools from '../DevTools';
import createReducer from '../Reducers';
import persistenceStore from './persistence/store';

const finalCreateStore = compose(
  applyMiddleware(thunk),
  persistenceStore
)(createStore);

function configureStore(initialState) {

  const store = finalCreateStore(createReducer(), initialState);
  store.asyncReducers = {};

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
