let config;

if (__DEVELOPMENT__) {
  config = require('./configureStore.dev').default;
} else {
  config = require('./configureStore.prod').default;
}

export default {
  configureStore: config.configureStore,
  injectAsyncReducer: config.injectAsyncReducer
};
