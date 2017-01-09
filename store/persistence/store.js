import * as storage from './storage';
import {actions as authActions} from '../../Components/Auth';
import * as constants from '../../constants';

export default function persistenceHandler (next) {
  return (reducer, initialState) => {
    const store = next(reducer, initialState);

    return Object.assign({}, store, {
      dispatch(action) {
        store.dispatch(action)

        if (action.type === authActions.CREATE_USER_SUCCESS ||
            action.type === authActions.LOGIN_SUCCESS) {
          storage.put(constants.AUTH_TOKEN_KEY, action.authToken);
          storage.put(constants.USER_KEY, JSON.stringify(action.user));
          return;
        }

        if (action.type === authActions.SIGN_OUT) {
          storage.remove(constants.AUTH_TOKEN_KEY);
          storage.remove(constants.USER_KEY);
        }
      }
    });
  }
}
