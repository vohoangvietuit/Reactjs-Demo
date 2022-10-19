import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Landing() {
  const { auth } = useSelector(state => {
    return {
      auth: state.auth 
    }
  });
  let history = useHistory();

  useEffect(() => {
    if (auth.isAuthenticated)  {
      history.push('/home');
    }
  }, []);
  
  return (
    <div className="landing">
      <div className="dark-overlay landing-inner">
        <div className="text-center">
          <h2 className="display-3 mb-4">Nash Store</h2>
          <p className="lead">Welcome to Nash private store</p>
          <p className="text-muted">
            To access store, you need to login/register your account
          </p>
          <hr />
          <Link to="/register" className="btn btn-lg btn-info mr-2">
            Register
          </Link>
          <Link to="/login" className="btn btn-lg btn-light">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;
