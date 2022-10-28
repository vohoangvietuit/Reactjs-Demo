import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from 'store/actions/authAction';

import TextFieldGroup from 'shared/components/TextFieldGroup';

import { ToastContainer } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import Spinner from 'shared/components/Spinner';
import { useForm, Controller } from 'react-hook-form';

function Login () {
  const { control, handleSubmit, formState: { errors: fieldErrors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const { auth, errors } = useSelector(state => state);
  const requiredMessage = 'This field is required';
  const dispatch = useDispatch();
  let history = useHistory();

  useEffect(() => {
    if (auth.isAuthenticated) {
      history.push('/home');
    }
  }, [auth.isAuthenticated]);

  const onSubmit = data => {
    dispatch(loginUser(data));
  };

  const spinner = auth.loading ? <Spinner /> : null;

  return (
    <div className="login">
      <div className="row">
        <div className="col-md-6 m-auto">
          { spinner }
          <h1 className="display-4 text-center">Log In</h1>
          <p className="lead text-center">Sign in to your account</p>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="email"
              control={control}
              rules={{
                required: requiredMessage
              }}
              render={({ field: { name, value, onChange } }) => <TextFieldGroup
                placeholder="Email Address"
                name={name}
                value={value}
                type="email"
                error={fieldErrors.email?.message || errors.email}
                onChange={onChange}
              />}
            >
            </Controller>

            <Controller
              name="password"
              control={control}
              rules={{
                required: requiredMessage
              }}
              render={({ field: { name, value, onChange } }) => <TextFieldGroup
                placeholder="Password"
                name={name}
                value={value}
                type="password"
                autoComplete="on"
                error={fieldErrors.password?.message || errors.password}
                onChange={onChange}
              />}
            >
            </Controller>

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
