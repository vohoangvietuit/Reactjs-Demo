import axios from 'axios';
import {
  GET_CATEGORIES,
  GET_CATEGORY,
  ADD_CATEGORY,
  DELETE_CATEGORY,
  GET_ERRORS,
  CLEAR_ERRORS,
  CATEGORY_LOADING
} from './type';
import { setProductLoading } from './productAction';

export const getCategories = () => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch(clearErrors());
    dispatch(setCategoryLoading());
    dispatch(setProductLoading());
    axios
      .get('/api/categories/all')
      .then(res => {
        dispatch({
          type: GET_CATEGORIES,
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

// Get category info
export const getCategory = id => dispatch => {
  dispatch(setCategoryLoading());
  axios
    .get(`/api/categories/${id}`)
    .then(res =>
      dispatch({
        type: GET_CATEGORY,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_CATEGORY,
        payload: {}
      })
    );
};

// Add Category
export const addCategory = (categoryData, history) => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post('/api/categories', categoryData)
      .then(res => {
        dispatch({
          type: ADD_CATEGORY,
          payload: res.data
        });
        history.push('/manage-categories');
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

// Edit category
export const editCategory = (id, categoryData, history) => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/categories/${id}`, categoryData)
      .then(res => {
        history.push('/manage-categories');
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

//Delete Category
export const deleteCategory = id => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/categories/${id}`)
      .then(res => {
        dispatch({
          type: DELETE_CATEGORY,
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

export const setCategoryLoading = () => {
  return {
    type: CATEGORY_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
