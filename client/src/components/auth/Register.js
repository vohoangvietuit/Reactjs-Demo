import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authAction';
import { withRouter } from 'react-router-dom';

import TextFieldGroup from '../common/TextFieldGroup';

import { toast, ToastContainer } from 'react-toastify';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      location: '',
      phone: '',
      password: '',
      password2: '',
      errors: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const userData = {
      name: this.state.name,
      email: this.state.email,
      location: this.state.location,
      phone: this.state.phone,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props
      .registerUser(userData, this.props.history)
      .then(res =>
        toast.success('Resgiter success, please login to your account', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 3000
        })
      )
      .catch(err =>
        toast.error('Error happen, try again!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1500
        })
      );
  };

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="row">
          <div className="col-md-6 m-auto">
            <h1 className="display-4 text-center">Sign Up</h1>
            <p className="lead text-center">
              Create your account, you can update your avatar when login
            </p>
            <form onSubmit={this.onSubmit} noValidate>
              <TextFieldGroup
                placeholder="Name"
                name="name"
                value={this.state.name}
                onChange={this.onChange}
                error={errors.name}
              />
              <TextFieldGroup
                placeholder="Email Address"
                name="email"
                type="email"
                value={this.state.email}
                onChange={this.onChange}
                error={errors.email}
              />
              <TextFieldGroup
                placeholder="Location"
                name="location"
                value={this.state.location}
                onChange={this.onChange}
                error={errors.location}
              />
              <TextFieldGroup
                placeholder="Phone"
                name="phone"
                value={this.state.phone}
                onChange={this.onChange}
                error={errors.phone}
              />
              <TextFieldGroup
                placeholder="Password"
                name="password"
                type="password"
                value={this.state.password}
                onChange={this.onChange}
                error={errors.password}
              />
              <TextFieldGroup
                placeholder="Confirm Password"
                name="password2"
                type="password"
                value={this.state.password2}
                onChange={this.onChange}
                error={errors.password2}
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
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
