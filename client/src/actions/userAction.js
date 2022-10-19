import axios from 'axios';
import {
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_USERS,
  GET_USER,
  ADD_USER,
  DELETE_USER,
  USER_LOADING
} from './type';

// Get user list
export const getUsers = () => dispatch => {
  dispatch(clearErrors());
  dispatch(setUserLoading());
  axios
    .get('/api/users/all')
    .then(res =>
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: []
      })
    );
};

// Get user info
export const getUser = id => dispatch => {
  dispatch(setUserLoading());
  axios
    .get(`/api/users/${id}`)
    .then(res =>
      dispatch({
        type: GET_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_USER,
        payload: {}
      })
    );
};

// Add user
export const addUser = (userData, history) => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post('/api/users/register', userData)
      .then(res => {
        dispatch({
          type: ADD_USER,
          payload: res.data
        });
        history.push('/manage-users');
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

// Edit user
export const editUser = (id, userData, history) => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/api/users/${id}`, userData)
      .then(res => {
        history.push('/manage-users');
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

//Delete USER
export const deleteUser = id => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/api/users/${id}`)
      .then(res => {
        dispatch({
          type: DELETE_USER,
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

export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};
