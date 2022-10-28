import {
  GET_CATEGORIES,
  GET_CATEGORY,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  CATEGORY_LOADING
} from 'store/actions/type';

const initialState = {
  categories: [],
  category: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
        category: {},
        loading: false
      };
    case CATEGORY_LOADING: {
      return {
        ...state,
        loading: true
      };
    }
    case GET_CATEGORY:
      return {
        ...state,
        category: action.payload,
        loading: false
      };
    case ADD_CATEGORY:
      return {
        ...state,
        categories: [action.payload, ...state.categories]
      };
    case DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(
          category => category._id !== action.payload
        )
      };
    default:
      return state;
  }
}
