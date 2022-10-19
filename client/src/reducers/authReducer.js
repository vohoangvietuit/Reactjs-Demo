import { LOADING, SET_CURRENT_USER } from '../actions/type';
import isEmpty from '../utils/is-empty';

const initialState = {
  isAuthenticated: false,
  user: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !isEmpty(action.payload)
      };
      case LOADING: {
        return {
          ...state,
          loading: true
        };
      }
    default:
      return state;
  }
}
