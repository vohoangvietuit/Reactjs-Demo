import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../actions/authAction';

function Navbar() {
  const dispatch = useDispatch();
  const { auth, cart } = useSelector(state => {
    return {
      auth: state.auth,
      cart: state.cart
    }
  });

  const onLogoutClick = e => {
    e.preventDefault();
    dispatch(logoutUser());
  };

  const addDefaultSrc = e => {
    e.target.src = '/uploads/default-avatar.jpg';
  };

  const { isAuthenticated, user } = auth;
  const { carts } = cart;

  const authLinks = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/home">
          Home
        </Link>
      </li>
      {auth.user.isAdmin ? (
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href=""
            id="navbardrop"
            data-toggle="dropdown"
          >
            Manage
          </a>
          <div className="dropdown-menu">
            <Link className="dropdown-item" to="/manage-users">
              User
            </Link>
            <Link className="dropdown-item" to="/manage-products">
              Product
            </Link>
            <Link className="dropdown-item" to="/manage-categories">
              Category
            </Link>
            <Link className="dropdown-item" to="/manage-orders">
              Order
            </Link>
          </div>
        </li>
      ) : null}
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href=""
          id="navbardrop"
          data-toggle="dropdown"
        >
          <img
            className="rounded-circle"
            src={user.avatar ? user.avatar : '/uploads/default-avatar.jpg'}
            alt={user.name}
            style={{ width: '25px', marginRight: '5px' }}
            title={
              user.avatar ? 'My Avatar' : 'Go to profile to upload avatar'
            }
            onError={addDefaultSrc}
          />
          {user.name}
        </a>
        <div className="dropdown-menu">
          <Link className="dropdown-item" to="/profile">
            Profile
          </Link>
          <Link className="dropdown-item" to="/change-password">
            Change password
          </Link>
          <a className="dropdown-item" onClick={onLogoutClick}>
            Sign out
          </a>
        </div>
      </li>
      <li className="nav-item ml-1">
        <Link className="nav-link" to="/cart">
          <div className="shopping-cart">
            <i className="fas fa-shopping-cart mr-1" />
            Cart
            {carts.length ? (
              <span className="badge badge-secondary ml-1">
                {carts.length}
              </span>
            ) : null}
          </div>
        </Link>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul className="navbar-nav ml-auto">
      <li className="nav-item">
        <Link className="nav-link" to="/register">
          Sign Up
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/login">
          Login
        </Link>
      </li>
    </ul>
  );
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/landing">
          Nash Store
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#mobile-nav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mobile-nav">
          {isAuthenticated ? authLinks : guestLinks}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
