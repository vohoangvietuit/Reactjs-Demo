import {
  CLEAR_CART,
  SET_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  PLUS_ITEM_CART,
  SUB_ITEM_CART
} from 'store/actions/type';

const initialState = {
  carts: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return {
        ...state,
        carts: [...action.payload]
      };
    case CLEAR_CART:
      return {
        ...state,
        carts: []
      };
    case ADD_TO_CART:
      // Check product in cart
      const itemFind = state.carts.find(
        item => item._id.toString() === action.payload._id.toString()
      );
      if (itemFind) {
        itemFind.quantity = itemFind.quantity + 1;
      } else {
        state.carts.unshift(action.payload);
      }

      return {
        ...state
      };
    case REMOVE_FROM_CART:
      return {
        ...state,
        carts: state.carts.filter(product => product._id !== action.payload)
      };

    case PLUS_ITEM_CART:
      // Check product in cart
      const itemFind1 = state.carts.find(
        item => item._id.toString() === action.payload.toString()
      );
      if (itemFind1) {
        itemFind1.quantity = itemFind1.quantity + 1;
      }
      return {
        ...state
      };

    case SUB_ITEM_CART:
      // Check product in cart
      const itemFind2 = state.carts.find(
        item => item._id.toString() === action.payload.toString()
      );
      if (itemFind2) {
        itemFind2.quantity = itemFind2.quantity - 1;
      }
      return {
        ...state
      };
    default:
      return state;
  }
}
