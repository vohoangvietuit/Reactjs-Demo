import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from 'shared/helpers/setAuthToken';
import PrivateRoute from 'shared/components/PrivateRoute';

import {
  // getCurrentUser,
  setCurrentUser,
  logoutUser
} from 'store/actions/authAction';

import { setCart } from 'store/actions/cartAction';

import { Provider } from 'react-redux';
import store from 'store/store';

import Navbar from 'pages/Layout/Navbar';
import Footer from 'pages/Layout/Footer';

import Landing from 'pages/Landing';
import Login from 'pages/Auth/Login';
import Register from 'pages/Auth/Register';
import ChangePassword from 'pages/Auth/ChangePassword';
import ChangeAvatar from 'pages/Auth/ChangeAvatar';

import UploadImage from 'shared/components/UploadImage/UploadImage';

import Home from 'pages/Home';
import Profile from 'pages/Profile';

import ManageUsers from 'pages/AdminManage/ManageUsers/ManageUsers';
import ManageProducts from 'pages/AdminManage/ManageProducts/ManageProducts';
import ManageCategories from 'pages/AdminManage/ManageCategories/ManageCategories';
import ManageOrders from 'pages/AdminManage/ManageOrders/ManageOrders';

// import ProductForm from 'modules/AdminManage/ManageProducts/ProductForm-unuse';
import EditProduct from 'pages/AdminManage/ManageProducts/EditProduct';
import AddProduct from 'pages/AdminManage/ManageProducts/AddProduct';

import EditUser from 'pages/AdminManage/ManageUsers/EditUser';
import AddUser from 'pages/AdminManage/ManageUsers/AddUser';

import EditCategory from 'pages/AdminManage/ManageCategories/EditCategory';
import AddCategory from 'pages/AdminManage/ManageCategories/AddCategory';

import EditOrder from 'pages/AdminManage/ManageOrders/EditOrder';

import Cart from 'pages/Cart';

import NotFound from 'pages/NotFound';

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
