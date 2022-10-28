// import axios from 'axios';
import {
  CLEAR_CART,
  SET_CART,
  ADD_TO_CART,
  REMOVE_FROM_CART,
  PLUS_ITEM_CART,
  SUB_ITEM_CART
} from './type';

// Add item to cart
export const addToCart = product => dispatch => {
  return new Promise((resolve, reject) => {
    if (localStorage.cart) {
      const cart = JSON.parse(localStorage.cart);

      // Check product in cart
      const itemFind = cart.find(
        item => item._id.toString() === product._id.toString()
      );
      if (itemFind) {
        itemFind.quantity = itemFind.quantity + 1;
      } else {
        cart.unshift(product);
      }

      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      const cart = [];
      cart.unshift(product);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    dispatch({
      type: ADD_TO_CART,
      payload: product
    });

    resolve();
  });
};

// Remove item from cart
export const removeFromCart = itemId => dispatch => {
  return new Promise((resolve, reject) => {
    if (localStorage.cart) {
      const cart = JSON.parse(localStorage.cart);

      // Find and splice item from cart
      const index = cart.findIndex(item => item._id === itemId);
      cart.splice(index, 1);

      localStorage.setItem('cart', JSON.stringify(cart));
    }

    dispatch({
      type: REMOVE_FROM_CART,
      payload: itemId
    });
    resolve();
  });
};

// Add cart from local storage
export const setCart = cart => {
  return {
    type: SET_CART,
    payload: cart
  };
};

// Plus item in cart
export const plusItemCart = itemId => {
  if (localStorage.cart) {
    const cart = JSON.parse(localStorage.cart);

    // Check product in cart
    const itemFind = cart.find(
      item => item._id.toString() === itemId.toString()
    );
    if (itemFind) {
      itemFind.quantity = itemFind.quantity + 1;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  return {
    type: PLUS_ITEM_CART,
    payload: itemId
  };
};

// Subtract item in cart
export const subItemCart = itemId => {
  if (localStorage.cart) {
    const cart = JSON.parse(localStorage.cart);

    // Check product in cart
    const itemFind = cart.find(
      item => item._id.toString() === itemId.toString()
    );
    if (itemFind) {
      itemFind.quantity = itemFind.quantity - 1;
    }

    localStorage.setItem('cart', JSON.stringify(cart));
  }

  return {
    type: SUB_ITEM_CART,
    payload: itemId
  };
};

export const clearCart = () => {
  localStorage.removeItem('cart');
  return {
    type: CLEAR_CART
  };
};
