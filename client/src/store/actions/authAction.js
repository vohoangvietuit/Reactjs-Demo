import axios from 'axios';
import setAuthToken from 'shared/helpers/setAuthToken';
// import jwt_decode from 'jwt-decode';
import { clearCart } from './cartAction';

import { GET_ERRORS, CLEAR_ERRORS, SET_CURRENT_USER, LOG_OUT, LOADING } from './type';

// Register
export const registerUser = (userData, history) => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post('/api/users/register', userData)
      .then(res => {
        history.push('/login');
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

// Login - Get user token
export const loginUser = userData => dispatch => {
  return new Promise((resolve, reject) => {
    // dispatch(loading());
    axios
      .post('/api/users/login', userData)
      .then(res => {
        const { token } = res.data;
        // Set token to localStore
        localStorage.setItem('jwtToken', token);

        // Set token to Auth header
        setAuthToken(token);

        // Decode token to get user data
        // const decode = jwt_decode(token);
        // Set current user
        // dispatch({
        //   type: SET_CURRENT_USER,
        //   payload: decode
        // });

        // get current user info set it to state
        dispatch(getCurrentUser());

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

// Change Password
export const changePassword = (passData, history) => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post('/api/users/change-password', passData)
      .then(res => {
        dispatch(clearErrors());
        dispatch(logoutUser());
        history.push('/login');
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

// Get current user info profile
export const getCurrentUser = () => dispatch => {
  axios
    .get('/api/users/current')
    .then(res => {
      // Set userInfo to localStore
      localStorage.setItem('userInfo', JSON.stringify(res.data));

      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      });
    })
    .catch(err =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      })
    );
};

// Update user profile
export const updateUserProfile = userData => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post('/api/users/update', userData)
      .then(res => {
        dispatch(getCurrentUser());
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

// Update user avatar
export const uploadUserAvatar = fileImage => dispatch => {
  return new Promise((resolve, reject) => {
    let data = new FormData();

    data.append('photo', fileImage);

    // for (let item of data.entries()) {
    //   console.log('item fileImage', item);
    // }

    axios
      .post('/api/users/update-avatar', data)
      .then(res => {
        dispatch(getCurrentUser());
        resolve();
      })
      .catch(err => console.log('err', err));
  });
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

// Logout user
export const logoutUser = () => dispatch => {
  // Remove local storage
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('userInfo');
  localStorage.removeItem('cart');

  // Remove auth header for future requests
  setAuthToken(false);
  // Reset state
  dispatch({
    type: LOG_OUT
  });
  // clear state cart
  dispatch(clearCart());
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS
  };
};

export const loading = () => {
  return {
    type: LOADING
  };
}
