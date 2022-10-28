import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import productReducer from './productReducer';
import categoryReducer from './categoryReducer';
import userReducer from './userReducer';
import cartReducer from './cartReducer';
import orderReducer from './orderReducer';
import { LOG_OUT } from 'store/actions/type';

const appReducer = combineReducers({
  errors: errorReducer,
  auth: authReducer,
  product: productReducer,
  category: categoryReducer,
  user: userReducer,
  cart: cartReducer,
  order: orderReducer
});

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined;
  }
  return appReducer(state, action);
};
export default rootReducer;
