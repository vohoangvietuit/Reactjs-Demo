import axios from 'axios';
import {
  ORDER_LOADING,
  GET_ORDERS,
  GET_ORDER,
  DELETE_ORDER,
  GET_ERRORS,
  CLEAR_ERRORS
} from './type';

import { clearCart } from './cartAction';

export const addOrder = (dataOrder, history) => dispatch => {
  return new Promise((resolve, reject) => {
    const dataForm = {
      phone: dataOrder.phone,
      address: dataOrder.address,
      note: dataOrder.note || '',
      item_list: dataOrder.item_list.map(item => {
        return {
          product: item._id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price
        };
      })
    };

    axios
      .post('/api/orders', dataForm)
      .then(res => {
        history.push('/home');
        dispatch(clearCart());
        resolve();
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
        reject();
      });
  });
};

export const getOrders = () => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch(clearErrors());
    dispatch(setOrderLoading());
    axios
      .get('/api/orders/all')
      .then(res => {
        dispatch({
          type: GET_ORDERS,
          payload: res.data
        });
        resolve();
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
        reject();
      });
  });
};

export const getOrder = id => dispatch => {
  dispatch(setOrderLoading());
  axios
    .get(`/api/orders/${id}`)
    .then(res => {
      dispatch({
        type: GET_ORDER,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ORDER,
        payload: {}
      });
    });
};

// Edit order
export const editOrder = (id, orderData, history) => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/orders/${id}`, orderData)
      .then(res => {
        history.push('/manage-orders');
        resolve();
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
        reject(err.response.data);
      });
  });
};

//Delete Order
export const deleteOrder = id => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/orders/${id}`)
      .then(res => {
        dispatch({
          type: DELETE_ORDER,
          payload: id
        });
        resolve();
      })
      .catch(err => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        });
        reject(err.response.data);
      });
  });
};

export const setOrderLoading = () => {
  return {
    type: ORDER_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
