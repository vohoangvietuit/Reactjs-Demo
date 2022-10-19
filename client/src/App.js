import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import PrivateRoute from './components/common/PrivateRoute';

import {
  // getCurrentUser,
  setCurrentUser,
  logoutUser
} from './actions/authAction';
import { setCart } from './actions/cartAction';

import { Provider } from 'react-redux';
import store from './store';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Landing from './components/landing/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChangePassword from './components/auth/ChangePassword';
import ChangeAvatar from './components/auth/ChangeAvatar';

import UploadImage from './components/for-me/UploadImage';

import Home from './components/home/Home';
import Profile from './components/profile/Profile';

import ManageUsers from './components/admin-manage/manage-users/ManageUsers';
import ManageProducts from './components/admin-manage/manage-products/ManageProducts';
import ManageCategories from './components/admin-manage/manage-categories/ManageCategories';
import ManageOrders from './components/admin-manage/manage-orders/ManageOrders';

// import ProductForm from './components/admin-manage/manage-products/ProductForm-unuse';
import EditProduct from './components/admin-manage/manage-products/EditProduct';
import AddProduct from './components/admin-manage/manage-products/AddProduct';

import EditUser from './components/admin-manage/manage-users/EditUser';
import AddUser from './components/admin-manage/manage-users/AddUser';

import EditCategory from './components/admin-manage/manage-categories/EditCategory';
import AddCategory from './components/admin-manage/manage-categories/AddCategory';

import EditOrder from './components/admin-manage/manage-orders/EditOrder';

import Cart from './components/cart/Cart';

import NotFound from './components/not-found/NotFound';

import './App.css';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);

  // Set user and isAuthentication
  // store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = '/login';
  }
}

if (localStorage.userInfo) {
  // Get current user info and Set user and isAuthentication
  const userInfo = JSON.parse(localStorage.userInfo);
  store.dispatch(setCurrentUser(userInfo));
}

// Check cart exist
if (localStorage.cart) {
  // Get cart and add set
  const cart = JSON.parse(localStorage.cart);
  store.dispatch(setCart(cart));
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Switch>
                {/* For public */}
                <Route exact path="/" component={Landing} />
                <Route exact path="/landing" component={Landing} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/upload-test" component={UploadImage} />

                {/* For public user */}
                <PrivateRoute
                  exact
                  path="/change-password"
                  component={ChangePassword}
                />
                <PrivateRoute
                  exact
                  path="/change-avatar"
                  component={ChangeAvatar}
                />
                <PrivateRoute exact path="/home" component={Home} />
                <PrivateRoute exact path="/profile" component={Profile} />

                {/* For admin */}
                <PrivateRoute
                  exact
                  path="/manage-users"
                  component={ManageUsers}
                  forAdmin={true}
                />
                <PrivateRoute
                  exact
                  path="/manage-users/edit/:id"
                  component={EditUser}
                  forAdmin={true}
                />
                <PrivateRoute
                  exact
                  path="/manage-users/add"
                  component={AddUser}
                  forAdmin={true}
                />

                <PrivateRoute
                  exact
                  path="/manage-products"
                  component={ManageProducts}
                  forAdmin={true}
                />
                <PrivateRoute
                  exact
                  path="/manage-products/add"
                  component={AddProduct}
                  forAdmin={true}
                />
                <PrivateRoute
                  exact
                  path="/manage-products/edit/:id"
                  component={EditProduct}
                  forAdmin={true}
                />

                <PrivateRoute
                  exact
                  path="/manage-categories"
                  component={ManageCategories}
                  forAdmin={true}
                />
                <PrivateRoute
                  exact
                  path="/manage-categories/add"
                  component={AddCategory}
                  forAdmin={true}
                />
                <PrivateRoute
                  exact
                  path="/manage-categories/edit/:id"
                  component={EditCategory}
                  forAdmin={true}
                />

                <PrivateRoute
                  exact
                  path="/manage-orders"
                  component={ManageOrders}
                  forAdmin={true}
                />
                <PrivateRoute
                  exact
                  path="/manage-orders/edit/:id"
                  component={EditOrder}
                  forAdmin={true}
                />
                <PrivateRoute exact path="/cart" component={Cart} />

                {/* No Match Page 404 */}
                <Route component={NotFound} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
