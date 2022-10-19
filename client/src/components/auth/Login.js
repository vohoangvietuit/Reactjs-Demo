import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../actions/authAction';

import TextFieldGroup from '../common/TextFieldGroup';

import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Spinner from '../common/Spinner';

function Login () {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { auth, errors } = useSelector(state => state);
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push('/home');
    }
  }, [auth.isAuthenticated]);

  const onSubmit = e => {
    e.preventDefault();

    const userData = {
      email,
      password
    };

    dispatch(loginUser(userData));
  };

  const spinner = auth.loading ? <Spinner /> : null;

  return (
    <div className="login">
      <div className="row">
        <div className="col-md-6 m-auto">
          { spinner }
          <h1 className="display-4 text-center">Log In</h1>
          <p className="lead text-center">Sign in to your account</p>
          <form onSubmit={onSubmit} noValidate>
            <TextFieldGroup
              placeholder="Email Address"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
            />

            <TextFieldGroup
              placeholder="Password"
              name="password"
              type="password"
              autoComplete="on"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
            />
            <input
              type="submit"
              value="Submit"
              className="btn btn-info btn-block mt-4"
            />
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
